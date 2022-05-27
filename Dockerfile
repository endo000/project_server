FROM node:16.14.2-slim
WORKDIR /node
COPY package.json .
RUN npm install
COPY . /node
CMD ["npm", "run", "start"]
EXPOSE 3001