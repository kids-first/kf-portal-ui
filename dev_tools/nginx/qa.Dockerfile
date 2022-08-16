FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY qa.crt /etc/nginx/qa.crt
COPY qa.key /etc/nginx/qa.key
COPY nginx-qa.conf /etc/nginx/conf.d/default.conf