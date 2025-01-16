import asyncio
from datetime import timedelta
from typing import List
import aiohttp
from sqlalchemy import select
from core import redis_db, SessionLocal
from models import LinkMapper


async def check_status(link: "LinkMapper"):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(link.original_url, timeout=15) as response:
                if 200 <= response.status < 300:
                    status = "active"
                else:
                    status = "inactive"
        except Exception:
            status = "inactive"
        redis_db.setex(name=link.id, value=status, time=timedelta(minutes=30))


async def get_links_from_db():
    with SessionLocal() as session:
        links = session.execute(select(LinkMapper.id, LinkMapper.original_url)).all()
    return links


async def process_link_batch(links: List["LinkMapper"]):
    tasks = [check_status(link) for link in links]
    await asyncio.gather(*tasks)


async def background_status_checker():
    while True:
        links = await get_links_from_db()
        for i in range(0, len(links), 100):
            batch = links[i : i + 100]
            await process_link_batch(batch)
        await asyncio.sleep(timedelta(minutes=25).seconds)
