# Stage 1, "build-stage-1", based on Node.js, to build and compile Angular
FROM node:16.10-slim as build-stage-1

# See https://crbug.com/795759
#RUN apt-get update && apt-get install -yq libgconf-2-4

WORKDIR /LiveChat_Implementation

COPY . /LiveChat_Implementation

RUN npm install

#ARG configuration=dev

#RUN npm run build -- --output-path=./dist/out --configuration $configuration
RUN npm run build --prod -- --output-path=./dist/out
#RUN npm run build --prod --output-path=./dist/out
#RUN npm install -g @angular/cli@latest
#RUN ng build --prod -- --output-path=./dist/out


# Stage 3, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine

COPY --from=build-stage-1 /LiveChat_Implementation/dist/out/ /usr/share/nginx/html

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 9610

ENTRYPOINT ["nginx", "-g", "daemon off;"]
