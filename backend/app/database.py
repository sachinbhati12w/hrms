import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL, tlsCAFile=certifi.where())
database = client[settings.DATABASE_NAME]

# Collections
employees_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")


async def ping_db():
    """Test the database connection."""
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False
