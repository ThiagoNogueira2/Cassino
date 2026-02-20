FROM php:8.2-fpm-alpine

# Instalar extensões PHP necessárias
RUN apk add --no-cache \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    zip \
    unzip \
    git \
    npm \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    opcache

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração PHP
COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini

# Definir variáveis de ambiente
ENV COMPOSER_ALLOW_SUPERUSER=1

# Expor porta
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
