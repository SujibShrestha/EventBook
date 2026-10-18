FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#For prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build 

EXPOSE 8000

CMD ["npm","start"]

