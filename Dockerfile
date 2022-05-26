FROM nikolaik/python-nodejs:python3.8-nodejs16
WORKDIR /node
COPY scripts/requirements.txt .
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install -r requirements.txt
COPY package.json .
RUN npm install
COPY . /node
CMD ["npm", "run", "start"]
EXPOSE 3001