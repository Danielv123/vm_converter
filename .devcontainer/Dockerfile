# Tailscale:
FROM mcr.microsoft.com/vscode/devcontainers/universal:linux as builder
USER root

# Magic DNS in a container where /etc/resolv.conf is a bind mount needed
# extra support, currently on a development branch.
WORKDIR /go/src/tailscale
#COPY . ./
RUN git clone https://github.com/tailscale/tailscale.git && cd tailscale && \
    go mod download && \
    go install -mod=readonly ./cmd/tailscaled ./cmd/tailscale && \
    cd .. && \
    git clone https://github.com/tailscale/codespace
#COPY . ./

# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.6/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-16
# ${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
ARG EXTRA_NODE_VERSION=18
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
RUN su node -c "npm install -g vue"

RUN sudo apt update
RUN apt install lynx -y
RUN curl  https://packages.microsoft.com/keys/microsoft.asc > MS.key
RUN apt-key add MS.key
RUN curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft.list
RUN sudo apt-get update
RUN sudo apt-get install -y powershell qemu-utils sshpass

# Tailscale
USER root
RUN apt-get update && apt-get install -y curl gpg dnsutils
COPY --from=builder /go/src/tailscale/codespace/tailscaled /etc/init.d
COPY --from=builder /go/src/tailscale/codespace/tailscaled /usr/sbin/tailscaled
COPY --from=builder /go/bin/tailscale /usr/bin/tailscale
RUN mkdir -p /var/run/tailscale /var/cache/tailscale /var/lib/tailscale

USER node

RUN pwsh -c "Set-PSRepository -Name PSGallery -InstallationPolicy Trusted" && \
    pwsh -c "Install-Module -Name PSDesiredStateConfiguration" && \
    # pwsh -c "Enable-ExperimentalFeature PSDesiredStateConfiguration.InvokeDscResource" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module VMware.PowerCLI -Scope CurrentUser" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module VMware.vSphereDSC -Scope CurrentUser" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module VMware.PSDesiredStateConfiguration -Scope CurrentUser" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module VMware.vSphere.SsoAdmin -Scope CurrentUser" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module PowerNSX -RequiredVersion 3.0.1174 -Scope CurrentUser" && \
    pwsh -c "\$ProgressPreference = \"SilentlyContinue\"; Install-Module PowervRA -RequiredVersion 3.6.0 -Scope CurrentUser"
