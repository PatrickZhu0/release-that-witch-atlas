"""Serve the packaged atlas on loopback and open its map, using Python 3."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen
import webbrowser

ROOT = Path(__file__).resolve().parents[1] / "dist"
HOST = "127.0.0.1"
PORT = 18763
URL = f"http://{HOST}:{PORT}/"

class AtlasHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".mjs": "text/javascript", ".map": "application/octet-stream"}

def open_atlas():
    handler = partial(AtlasHandler, directory=str(ROOT))
    try:
        server = ThreadingHTTPServer((HOST, PORT), handler)
    except OSError:
        try:
            local_data = (ROOT / "atlas-data.json").read_bytes()
            with urlopen(URL + "atlas-data.json", timeout=2) as response:
                if response.read(len(local_data) + 1) == local_data:
                    webbrowser.open(URL)
                    return
        except (URLError, OSError):
            pass
        server = ThreadingHTTPServer((HOST, 0), handler)
    with server:
        address = f"http://{HOST}:{server.server_port}/"
        print(f"Graycastle Atlas: {address}   (Ctrl+C to stop)")
        webbrowser.open(address)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    open_atlas()

