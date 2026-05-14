{{- define "cloudcart.name" -}}
cloudcart
{{- end -}}

{{- define "cloudcart.labels" -}}
app.kubernetes.io/name: {{ include "cloudcart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}
