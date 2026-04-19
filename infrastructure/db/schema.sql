-- OmniFlow: Intelligent Event Experience Platform
-- Core Operational Database Schema
-- Target: Amazon Aurora PostgreSQL

-- 1. USERS
-- device_id is structurally decoupled to ensure anonymity while tracking telemetry
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(255) UNIQUE NOT NULL, 
    ticket_tier VARCHAR(50) DEFAULT 'GA', -- Used by Notification Engine for targeted routing (e.g., VIP gets faster routes)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_device_id ON users(device_id);

-- 2. EVENTS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_attendance INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 3. TICKET_ENTITLEMENTS
-- Maps active devices to an event profile
CREATE TABLE ticket_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    entry_gate VARCHAR(50),
    UNIQUE(user_id, event_id)
);
CREATE INDEX idx_tickets_uid ON ticket_entitlements(user_id);

-- 4. ZONES
-- Represents physical regions of the nav-mesh. Polygons used by Apache Flink.
CREATE TABLE zones (
    id VARCHAR(50) PRIMARY KEY, -- 'ZN-SOUTH-CONCOURSE'
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    polygon_geojson JSONB NOT NULL,
    capacity_max INTEGER NOT NULL,
    safe_throughput_rate INTEGER NOT NULL -- People per minute limit
);
-- In production, PostGIS extension would be used: 
-- CREATE INDEX idx_zones_polygon ON zones USING GIST (ST_GeomFromGeoJSON(polygon_geojson));

-- 5. POIS (Points of Interest)
CREATE TABLE pois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id VARCHAR(50) REFERENCES zones(id),
    poi_type VARCHAR(50) NOT NULL, -- RESTROOM, FOOD, EXIT
    name VARCHAR(255) NOT NULL,
    lat_lng JSONB NOT NULL -- Expected schema: { "lat": Float, "lng": Float }
);
CREATE INDEX idx_pois_zone ON pois(zone_id);
