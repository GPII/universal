FROM inclusivedesign/nodejs:0.10.33
 
RUN yum -y install git && \
yum clean all
 
RUN mkdir -p /opt/universal
 
# Reduce the number of times 'npm install' is run by copying package.json
# first and the remaining repository contents later
COPY package.json /opt/universal/
 
WORKDIR /opt/universal
 
RUN npm install
 
COPY . /opt/universal/
 
RUN yum -y install nodejs-grunt-cli && \
grunt dedupe-infusion && \
yum -y autoremove nodejs-grunt-cli && \
yum clean all
 
CMD ["/bin/bash"] 
