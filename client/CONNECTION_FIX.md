# Player Connection Status Fix

## The Problem
When creating a new room, the player's name appeared with "(غير متصل)" (not connected) status.

## Root Cause
The `Room.addPlayer()` method wasn't properly removing old player entries when a player rejoined with a new socket ID (which happens on page refresh or reconnection). This resulted in:
- Old entry: socketId=abc123, name="Player1", connected=false
- New entry: socketId=def456, name="Player1", connected=true

Both entries remained in the player list, causing the player to appear both as connected and disconnected.

## Fixes Applied

### Server-Side Changes

#### 1. `server/src/rooms/Room.js`
- **Fixed `addPlayer()`**: Now removes ANY existing player entry with the same name (not just disconnected ones)
- **Added `cleanupDisconnectedPlayers()`**: Removes players disconnected for >5 minutes when new players join
- **Called cleanup in `addPlayer()`**: Ensures old stale entries are cleaned up

#### 2. `server/src/socket/index.js`
- **Fixed disconnect handler**: Changed `socket.to()` to `io.in()` to ensure all players receive the disconnect notification

### Client-Side Changes

#### 3. `client/src/components/room/PlayerList.jsx`
- Added visual distinction for disconnected players (strikethrough, opacity)
- Added explanation text in disconnected section
- Added CSS class for disconnected player styling

#### 4. `client/src/styles/components/PlayerList.css`
- Added `.disconnected-player` styling (strikethrough, reduced opacity)
- Added `.disconnected-hint` for explanatory text

## How It Works Now

1. Player creates/joins room
2. Server checks for any existing player with same name
3. If found, removes the old entry completely
4. Adds new player entry with `connected: true`
5. Broadcasts updated room state to all players
6. Player appears only once as "connected"

## Testing

1. Create a new room - should show as connected
2. Refresh the page - should still show as connected (not duplicate)
3. Open multiple tabs - each should show as separate connected players
4. Close a tab - should show as disconnected briefly, then removed

## Visual Changes

- Disconnected players now have strikethrough text and reduced opacity
- Added explanation text: "هؤلاء اللاعبين انفصلوا عن اللعبة"
- Current player is highlighted with yellow border
