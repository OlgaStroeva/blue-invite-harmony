# Используем Node.js
FROM node:20

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт Vite
EXPOSE 3000

# Запускаем dev-сервер
CMD ["npx", "vite", "--host"]
