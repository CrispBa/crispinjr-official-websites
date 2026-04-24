#!/usr/bin/env python3
"""
🔄 LiveReload Development Server
Aesthetic auto-refresh server for frontend development.
"""

import argparse
import sys
from pathlib import Path
from typing import List

from livereload import Server


# ── ANSI Colors ──
class Color:
    CYAN = "\033[36m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    RED = "\033[31m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"


# ── Configuration ──
WATCH_PATTERNS: List[str] = [
    "*.html",
    "*.css",
    "*.js",
    "**/*.html",
    "**/*.css",
    "**/*.js",
    "*.svg",
    "*.png",
    "*.jpg",
    "**/*.svg",
]


def print_banner(host: str, port: int) -> None:
    """Display a fancy startup banner."""
    banner = f"""
{Color.CYAN}{Color.BOLD}╔══════════════════════════════════════════╗
║                                          ║
║      ⚡  LIVE RELOAD SERVER  ⚡          ║
║                                          ║
╚══════════════════════════════════════════╝{Color.RESET}

{Color.GREEN}► Server:{Color.RESET}    http://{host}:{port}
{Color.GREEN}► Status:{Color.RESET}    {Color.BOLD}Running{Color.RESET}
{Color.YELLOW}► Watch:{Color.RESET}     HTML, CSS, JS, SVG, Images
{Color.DIM}► Tip:{Color.RESET}       Save any file to auto-refresh the browser
"""
    print(banner)


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="🔄 LiveReload development server with auto-refresh",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: python server.py --host 0.0.0.0 --port 8080",
    )
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        help="Host to bind to (default: 0.0.0.0)",
    )
    parser.add_argument(
        "-p", "--port",
        type=int,
        default=8652,
        help="Port to listen on (default: 8652)",
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Root directory to serve (default: current directory)",
    )
    return parser.parse_args()


def validate_root(path: str) -> Path:
    """Ensure the root directory exists."""
    root = Path(path).resolve()
    if not root.exists():
        print(f"{Color.RED}✖ Error: Directory '{path}' does not exist.{Color.RESET}")
        sys.exit(1)
    return root


def main() -> None:
    args = parse_args()
    root = validate_root(args.root)

    print_banner(args.host, args.port)

    server = Server()

    # Watch all configured patterns
    for pattern in WATCH_PATTERNS:
        server.watch(pattern)

    try:
        server.serve(
            port=args.port,
            host=args.host,
            root=str(root),
            open_url_delay=None,
        )
    except KeyboardInterrupt:
        print(f"\n\n{Color.YELLOW}⚡ Server stopped by user.{Color.RESET}")
        sys.exit(0)
    except OSError as e:
        print(f"\n{Color.RED}✖ Error: {e}{Color.RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()