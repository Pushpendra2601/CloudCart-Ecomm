FROM jenkins/jenkins:lts-jdk21

USER root

ARG KUBECTL_VERSION=v1.34.1
ARG HELM_VERSION=v3.18.6
ARG TRIVY_VERSION=0.66.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    docker.io \
    git \
    gnupg \
    gzip \
    tar \
    unzip \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSLo /usr/local/bin/kubectl "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" \
  && chmod +x /usr/local/bin/kubectl

RUN curl -fsSLo /tmp/helm.tar.gz "https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz" \
  && tar -xzf /tmp/helm.tar.gz -C /tmp \
  && mv /tmp/linux-amd64/helm /usr/local/bin/helm \
  && chmod +x /usr/local/bin/helm \
  && rm -rf /tmp/helm.tar.gz /tmp/linux-amd64

RUN curl -fsSLo /tmp/trivy.tar.gz "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_Linux-64bit.tar.gz" \
  && tar -xzf /tmp/trivy.tar.gz -C /tmp trivy \
  && mv /tmp/trivy /usr/local/bin/trivy \
  && chmod +x /usr/local/bin/trivy \
  && rm -rf /tmp/trivy.tar.gz

RUN usermod -aG docker jenkins

USER jenkins

RUN jenkins-plugin-cli --plugins \
  kubernetes \
  workflow-aggregator \
  git \
  github \
  docker-workflow \
  credentials-binding \
  pipeline-stage-view \
  blueocean
