FROM inclusivedesign/nodejs:0.10.40

WORKDIR /etc/ansible/playbooks

COPY provisioning/* /etc/ansible/playbooks/

ENV INSTALL_DIR=/opt/gpii/node_modules/universal

COPY . $INSTALL_DIR

RUN ansible-playbook docker-build.yml --tags "install,configure"

CMD ["/bin/bash"]
