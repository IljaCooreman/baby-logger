FROM node:12.6.0-alpine as backend-build

ARG PRISMA_SECRET
ENV PRISMA_SECRET ${PRISMA_SECRET}

# our dest
WORKDIR /app

# let's install our dependencies
COPY package.json yarn.lock ./
RUN yarn
COPY . ./

RUN yarn build

CMD ["node", "/app/dist/index.js"]