import os
from flask import Flask, send_from_directory, abort, render_template

# Инициализация Flask приложения
app = Flask(__name__)

# Директория, где хранятся MP3 файлы нот
NOTES_DIR = 'notes'

# Убедимся, что директория для нот существует (для удобства разработки)
if not os.path.exists(NOTES_DIR):
    print(f"Внимание: Директория '{NOTES_DIR}' не найдена. Создаю её.")
    os.makedirs(NOTES_DIR)

@app.route('/play_note/<int:note_id>')
def serve_note(note_id):
    """
    Маршрут для обслуживания аудиофайла по его ID.
    Пример: /play_note/1 вернет note1.mp3
    """
    filename = f"note{note_id}.mp3"
    
    # print(f"Запрос на файл: {filename}")
    
    try:
        # Безопасно отправляем файл из директории NOTES_DIR
        return send_from_directory(
            NOTES_DIR, 
            filename, 
            as_attachment=False, 
            mimetype='audio/mpeg'
        )
    except FileNotFoundError:
        # Если файл не найден, возвращаем ошибку 404
        print(f"Ошибка: Файл {filename} не найден.")
        abort(404, description=f"Note file {filename} not found.")

if __name__ == '__main__':
    # Запуск сервера
    # В продакшене используйте WSGI сервер (например, Gunicorn)
    app.run(debug=True)