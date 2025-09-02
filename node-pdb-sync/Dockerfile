FROM node:24

RUN apt-get update && apt-get install -y git graphicsmagick rsync

### PyMol dependencies for building
RUN apt-get install -y build-essential python-dev python-pmw libglew-dev \
    freeglut3-dev libpng-dev libfreetype6-dev libxml2-dev \
    libmsgpack-dev python-pyqt5.qtopengl libglm-dev python3-dev

### PyMol
WORKDIR /pymol
RUN wget --no-verbose https://sourceforge.net/projects/pymol/files/pymol/1.8/pymol-v1.8.6.0.tar.bz2
RUN tar jxf pymol-v1.8.6.0.tar.bz2
RUN rm pymol-v*
WORKDIR pymol
RUN python3 setup.py build install --use-msgpackc=no

### Remove pymol dependencies for building
RUN apt-get remove -y build-essential python-dev python-pmw libglew-dev \
    freeglut3-dev libpng-dev libfreetype6-dev libxml2-dev \
    libmsgpack-dev python-pyqt5.qtopengl libglm-dev python3-dev


COPY src /node-pdb
RUN rm -rf /node-pdb/node_modules

WORKDIR /node-pdb
RUN npm i --production && rm -rf /root/.npm /usr/local/share/.cache /root/.cache

CMD node
# CMD npm run cron

ADD VERSION .

