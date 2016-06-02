FROM inclusivedesign/nodejs:lts

WORKDIR /etc/ansible/playbooks

COPY provisioning/* /etc/ansible/playbooks/

ENV INSTALL_DIR=/opt/gpii/node_modules/universal

ENV UNIVERSAL_VARS_FILE=docker-vars.yml

COPY . $INSTALL_DIR

RUN ansible-playbook playbook.yml --tags "install,configure"

CMD ["/bin/bash"]
