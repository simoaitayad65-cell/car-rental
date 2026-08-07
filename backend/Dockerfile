FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# Config de l'image (build + démarrage)
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Config Laravel (production)
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Autorise composer à s'exécuter en tant que root dans le conteneur
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]
