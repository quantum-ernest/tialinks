from uvicorn.logging import AccessFormatter

from core import process_time_ctx
import logging


class CustomFormatter(AccessFormatter):
    def formatMessage(self, record: logging.LogRecord) -> str:
        record.process_time = record.process_time if record.process_time else 0.0
        return super().formatMessage(record)


old_factory = logging.getLogRecordFactory()


def record_factory(*args, **kwargs):
    record = old_factory(*args, **kwargs)
    record.process_time = process_time_ctx.get()
    return record


logging.setLogRecordFactory(record_factory)
