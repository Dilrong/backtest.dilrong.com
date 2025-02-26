import logging
import sys
import os
from fluent import handler as fluent_handler
from logging.handlers import TimedRotatingFileHandler
from app.core.config import settings

# 로그 폴더 생성
LOG_DIR = settings.LOG_DIR
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# 로그 포맷
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"

# 콘솔 핸들러
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(logging.Formatter(LOG_FORMAT))

# Fluent 핸들러
fluent_handler = fluent_handler.FluentHandler(
        tag="discord_bot.backend",
        host="localhost",
        port=24224,
    )

# INFO 핸들러
info_handler = TimedRotatingFileHandler(
    filename=os.path.join(LOG_DIR, "info.log"),
    when="midnight",
    interval=1,
    backupCount=7,
    encoding="utf-8",
)
info_handler.suffix = "%Y-%m-%d"
info_handler.setFormatter(logging.Formatter(LOG_FORMAT))
info_handler.setLevel(logging.INFO)

# ERROR 핸들러
error_handler = TimedRotatingFileHandler(
    filename=os.path.join(LOG_DIR, "error.log"),
    when="midnight",
    interval=1,
    backupCount=7,
    encoding="utf-8",
)
error_handler.suffix = "%Y-%m-%d"
error_handler.setFormatter(logging.Formatter(LOG_FORMAT))
error_handler.setLevel(logging.ERROR)

# 로거 생성
logger = logging.getLogger("app_logger")
logger.setLevel(getattr(logging, settings.LOG_LEVEL, logging.INFO))

# 핸들러 추가
logger.addHandler(console_handler)
logger.addHandler(fluent_handler)
logger.addHandler(info_handler)
logger.addHandler(error_handler)


def get_logger():
    return logger
