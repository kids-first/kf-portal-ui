FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY prd.crt /etc/nginx/prd.crt
COPY prd.key /etc/nginx/prd.key
COPY nginx-prd.conf /etc/nginx/conf.d/default.conf