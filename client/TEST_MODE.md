# Game Starting with 2 Players

## Change Made

Changed the minimum player requirement from **4 players** to **2 players** for testing purposes.

## Files Modified

### `client/src/app/pages/RoomPage.jsx`
- Line 132: Changed `room.players?.length >= 4` to `room.players?.length >= 2`
- Updated the message from "4 players required" to "2 players minimum"

## How to Test

1. Open your game in the browser
2. Create a new room
3. You can now start the game with just **2 players**!
4. The "Start Game" button will be enabled when 2+ players join

## Note

The game logic supports any number of players. With only 2 players:
- Both players will need to play multiple roles (switching between spymaster and operative)
- This is perfect for testing the game mechanics
- In production, you might want to change it back to 4 for the full team experience

## To Change Back to 4 Players

If you want to require 4 players again, simply change line 132 in `RoomPage.jsx`:

```javascript
const canStart = room && room.players?.length >= 4;
```

And update the message:
```javascript
<p className="hint">👥 تحتاج إلى 4 لاعبين (موجود: {room?.players?.length || 0})</p>
```
