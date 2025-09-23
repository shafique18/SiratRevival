# backend/app/fetchers/youtube_fetcher.py
import os
from googleapiclient.discovery import build
from datetime import datetime
from slugify import slugify

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def get_channel_videos(channel_id, max_results=10):
    """
    Returns list of videos metadata for a channel (title, videoId, publishedAt, thumbnail, description, duration not included).
    Requires YOUTUBE_API_KEY.
    """
    if not YOUTUBE_API_KEY:
        raise RuntimeError("YOUTUBE_API_KEY required for YouTube API calls")
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    # fetch uploads playlist id
    ch = youtube.channels().list(part="contentDetails", id=channel_id).execute()
    uploads = ch['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    res = []
    nextPageToken = None
    while True:
        pl = youtube.playlistItems().list(
            playlistId=uploads, part="snippet", maxResults=min(50, max_results), pageToken=nextPageToken
        ).execute()
        for item in pl.get("items", []):
            snip = item['snippet']
            video_id = snip['resourceId']['videoId']
            res.append({
                "title": snip['title'],
                "external_id": video_id,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": snip['thumbnails'].get('high', {}).get('url'),
                "summary": snip.get('description'),
                "published_at": datetime.strptime(snip['publishedAt'], "%Y-%m-%dT%H:%M:%SZ"),
                "source": "youtube",
                "medium": "video",
                "slug": slugify(snip['title'])[:250]
            })
        nextPageToken = pl.get('nextPageToken')
        if not nextPageToken or len(res) >= max_results:
            break
    return res
