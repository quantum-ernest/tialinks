import random
import re
import requests
from user_agents import parse
from urllib.parse import urlparse


def camel_to_snake(name):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def generate_readable_short_code(length=6):
    custom_charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
    return "".join(random.choices(custom_charset, k=length))


def extract_user_agent(value: str) -> dict:
    user_agent = parse(value)
    data = {
        "operating_system": user_agent.os.family if user_agent.os.family else None,
        "browser": user_agent.browser.family if user_agent.browser.family else None,
        "device": user_agent.device.family if user_agent.device.family else None,
    }
    return {k: v for k, v in data.items() if v}


def extract_referer(value: str) -> dict:
    referrer = urlparse(value)
    data = {
        "full_url": value,
        "domain": referrer.netloc if referrer.netloc else None,
        "path": referrer.path if referrer.path else None,
    }
    return {k: v for k, v in data.items() if v}


def extract_location(value: str) -> dict:
    url = f"http://ip-api.com/json/{value}?fields=status,message,continent,country,regionName,city"
    response = requests.get(url)
    if response.json().get("status") == "success":
        data = response.json()
        data = {
            "continent": data.get("continent"),
            "country": data.get("country"),
            "region": data.get("regionName"),
            "city": data.get("city"),
        }
        return data
    return {}
