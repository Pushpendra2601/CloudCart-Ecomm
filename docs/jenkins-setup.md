# Jenkins Setup Guide

This guide sets up Jenkins for the CloudCart project in a safe sequence.

These commands assume you are running from WSL/Linux, not PowerShell.

If Jenkins is already installed on Windows, keep that Jenkins controller and attach WSL as a Linux agent. The project Jenkinsfile uses:

```groovy
agent {
  label 'wsl-linux'
}
```

So Jenkins will only run this pipeline on an agent with the `wsl-linux` label.

## Existing Windows Jenkins + WSL Agent

Use this path if Jenkins is already running locally on Windows.

### 1. Install Runtime Tools In WSL

In WSL:

```bash
sudo apt update
sudo apt install -y openjdk-21-jre git curl ca-certificates
```

Verify the project tools:

```bash
java -version
git --version
docker --version
kubectl version --client
helm version
trivy --version
```

If Helm is missing:

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

If Trivy is missing:

```bash
sudo apt-get install -y wget apt-transport-https gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt update
sudo apt install -y trivy
```

### 2. Create Jenkins Agent Node

In Jenkins UI:

```text
Manage Jenkins
Nodes
New Node
Node name: wsl-agent
Type: Permanent Agent
```

Use:

```text
Remote root directory: /home/<your-actual-wsl-user>/jenkins-agent
Labels: wsl-linux
Usage: Only build jobs with label expressions matching this node
Launch method: Launch agent by connecting it to the controller
```

Save the node.

Do not leave the placeholder `YOUR_WSL_USER` in Jenkins. Check your real WSL user with:

```bash
whoami
echo $HOME
```

For example, if `whoami` prints `pushpendra`, use:

```text
/home/pushpendra/jenkins-agent
```

### 3. Start The Agent From WSL

Create the agent workspace:

```bash
mkdir -p ~/jenkins-agent
cd ~/jenkins-agent
```

On the Jenkins node page, Jenkins will show an agent command similar to:

```bash
curl -sO http://localhost:8080/jnlpJars/agent.jar
java -jar agent.jar -url http://localhost:8080/ -secret YOUR_SECRET -name wsl-agent -workDir "/home/<your-actual-wsl-user>/jenkins-agent"
```

Run that command from WSL.

If `localhost` does not reach Jenkins from WSL, get the Windows host IP:

```bash
cat /etc/resolv.conf | grep nameserver
```

Then use:

```bash
http://WINDOWS_HOST_IP:8080/
```

Keep this terminal running while testing the pipeline.

### 4. Verify Jenkins Uses WSL

Run the pipeline. In Console Output, you should see it scheduled on:

```text
wsl-agent
```

You can also temporarily add this test stage to verify the environment:

```groovy
stage('Agent Diagnostics') {
  steps {
    sh '''
      uname -a
      pwd
      whoami
      docker --version
      kubectl version --client
      helm version
      trivy --version
    '''
  }
}
```

The Jenkins pipeline runs backend tests inside a `node:22-alpine` Docker container, so Node.js and npm do not need to be installed directly on the WSL agent.

1. Run Jenkins with Docker.
2. Connect GitHub.
3. Add registry credentials.
4. Run build/test/scan/push.
5. Enable Helm deployment to Kubernetes.

## 1. Start Jenkins

From the project root:

```bash
cd jenkins
docker compose up -d --build
```

Open Jenkins:

```text
http://localhost:8081
```

Get the initial admin password:

```bash
docker exec cloudcart-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Install suggested plugins if Jenkins asks. The custom image already includes the main plugins needed for this project.

## 2. Verify Tools Inside Jenkins

```bash
docker exec cloudcart-jenkins docker --version
docker exec cloudcart-jenkins kubectl version --client
docker exec cloudcart-jenkins helm version
docker exec cloudcart-jenkins trivy --version
```

Why these matter:

- Docker builds CloudCart images.
- Kubectl verifies Kubernetes rollout.
- Helm deploys the chart.
- Trivy blocks vulnerable images.

## 3. Create Container Registry Credentials

Recommended registry: GitHub Container Registry.

Create a GitHub personal access token with:

```text
write:packages
read:packages
repo
```

In Jenkins:

```text
Manage Jenkins
Credentials
System
Global credentials
Add Credentials
```

Use:

```text
Kind: Username with password
Username: YOUR_GITHUB_USERNAME
Password: YOUR_GITHUB_PAT
ID: registry-creds
Description: GHCR registry credentials
```

The Jenkinsfile expects this exact credential ID:

```text
registry-creds
```

## 4. Update Registry Owner

Edit `jenkins/Jenkinsfile` and replace:

```groovy
REGISTRY = "ghcr.io/YOUR_USER"
```

With:

```groovy
REGISTRY = "ghcr.io/YOUR_GITHUB_USERNAME"
```

## 5. Create Jenkins Pipeline

In Jenkins:

```text
New Item
Pipeline
Name: cloudcart-devops-platform
Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/YOUR_USER/cloudcart-devops-platform.git
Branch: */main
Script Path: jenkins/Jenkinsfile
Save
Build Now
```

## 6. First Expected Pipeline Flow

The pipeline should run:

```text
Checkout
Backend Tests
Build Images
Security Scan
Push Images
Deploy to Kubernetes
Verify Rollout
```

If you want to test only build/push before Kubernetes deployment, temporarily comment out these stages in `jenkins/Jenkinsfile`:

```text
Deploy to Kubernetes
Verify Rollout
```

## 7. Kubernetes Access

The Docker Compose setup mounts your local kubeconfig into Jenkins:

```yaml
${HOME}/.kube:/var/jenkins_home/.kube:ro
```

Verify cluster access:

```bash
docker exec cloudcart-jenkins kubectl get nodes
```

If this fails, fix Kubernetes access before running the deploy stage.

For WSL, also verify these before starting Jenkins:

```bash
docker version
kubectl config current-context
kubectl get nodes
ls -la ~/.kube
```

If Docker works in Windows but not WSL, enable Docker Desktop WSL integration for your distro.

## 8. Deploy With Jenkins

After registry credentials and Kubernetes access are ready, Jenkins will run:

```bash
helm upgrade --install cloudcart helm/cloudcart \
  --namespace cloudcart \
  --create-namespace \
  --set backend.image.repository=ghcr.io/YOUR_USER/cloudcart-backend \
  --set backend.image.tag=BUILD-SHA \
  --set frontend.image.repository=ghcr.io/YOUR_USER/cloudcart-frontend \
  --set frontend.image.tag=BUILD-SHA \
  --atomic \
  --timeout 5m
```

The namespace is created before Helm deploy so Jenkins can also create the GHCR image pull secret. The Helm chart does not manage the namespace object directly.

## 9. Common Jenkins Issues

### Docker Permission Denied

Check:

```bash
docker exec cloudcart-jenkins docker ps
```

If it fails, Docker socket mounting is not working.

### GHCR Push Denied

Check:

```text
registry-creds credential ID
GitHub username
PAT scopes
REGISTRY value in Jenkinsfile
```

### Helm Deploy Fails

Run:

```bash
docker exec cloudcart-jenkins helm lint /var/jenkins_home/workspace/cloudcart-devops-platform/helm/cloudcart
docker exec cloudcart-jenkins kubectl get pods -n cloudcart
docker exec cloudcart-jenkins kubectl get events -n cloudcart --sort-by=.lastTimestamp
```

### Trivy Fails Build

That is expected if HIGH or CRITICAL vulnerabilities are found.

For learning only, you can temporarily change:

```bash
trivy image --severity HIGH,CRITICAL --exit-code 1
```

To:

```bash
trivy image --severity HIGH,CRITICAL --exit-code 0
```

For a real portfolio project, keep `--exit-code 1`.
