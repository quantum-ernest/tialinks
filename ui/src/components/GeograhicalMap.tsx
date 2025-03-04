"use client";

import React, { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Card, Select, Spin } from "antd";
import "leaflet/dist/leaflet.css";
import { GeographicalDataType } from "@/schemas/Analytics";
import { Coordinate, Location } from "@/schemas/misc";

async function geocode(locationName: string): Promise<Coordinate> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return [0, 0] as Coordinate;
}

export default function GeographicalMap({
  value,
}: {
  value: GeographicalDataType;
}) {
  const [view, setView] = useState<
    "continents" | "countries" | "regions" | "cities"
  >("continents");
  const [data, setData] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const GeoData = {
    continents: value?.continents,
    countries: value?.countries,
    regions: value?.regions,
    cities: value?.cities,
  };
  useEffect(() => {
    async function fetchCoordinates() {
      setLoading(true);
      if (GeoData[view]) {
        const newData = await Promise.all(
          GeoData[view].map(async (item) => {
            const coordinates =
              item.name.toLowerCase() === "unknown"
                ? ([0, 0] as Coordinate)
                : await geocode(item.name);
            return { ...item, coordinates };
          }),
        );
        setData(newData);
        setLoading(false);
      }
    }

    fetchCoordinates();
  }, [view, value]);

  const maxClicks = Math.max(...data.map((d) => d.click_count));
  const minClicks = Math.min(...data.map((d) => d.click_count));

  const getMarkerSize = (clicks: number) => {
    const minSize = 5;
    const maxSize = 20;
    return (
      minSize +
      ((clicks - minClicks) / (maxClicks - minClicks)) * (maxSize - minSize)
    );
  };

  const getMarkerColor = (clicks: number) => {
    const ratio = (clicks - minClicks) / (maxClicks - minClicks);
    const hue = ((1 - ratio) * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
  };
  return (
    <Card
      style={{ marginTop: 16 }}
      title="Geographical Distribution of Clicks"
      extra={
        <Select
          style={{ width: 180 }}
          value={view}
          onChange={setView}
          options={[
            { value: "continents", label: "Continents" },
            { value: "countries", label: "Countries" },
            { value: "regions", label: "Regions" },
            { value: "cities", label: "Cities" },
          ]}
        />
      }
    >
      <div style={{ height: "500px", width: "100%", position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          placeholder={
            <p>
              Map of London.{" "}
              <noscript>
                You need to enable JavaScript to see this map.
              </noscript>
            </p>
          }
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {data.map(
            ({ name, coordinates, click_count }) =>
              coordinates && (
                <CircleMarker
                  key={name}
                  center={coordinates}
                  radius={getMarkerSize(click_count)}
                  fillColor={getMarkerColor(click_count)}
                  color="#000"
                  weight={1}
                >
                  <Popup>
                    <div>
                      <h3>{name}</h3>
                      <p>{click_count.toLocaleString()} Clicks</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ),
          )}
        </MapContainer>
      </div>
    </Card>
  );
}
