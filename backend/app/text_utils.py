import re

_TAG_RE = re.compile(r"<[^>]+>")


def strip_html(html: str) -> str:
    return re.sub(r"\s+", " ", _TAG_RE.sub(" ", html)).strip()
