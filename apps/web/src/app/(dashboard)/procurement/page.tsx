'use client';

import { useState } from 'react';

const CATALOG = [
  {
    "id": "1",
    "name": "S-400 Triumf Regiment",
    "category": "LONG_RANGE",
    "cost": 1090,
    "maintenance": 49,
    "range": 400,
    "accuracy": 92,
    "color": "#ef4444",
    "owned": 2,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "2",
    "name": "Barak 8 ER SAM Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 650,
    "maintenance": 29.3,
    "range": 150,
    "accuracy": 88,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "3",
    "name": "MRSAM / Barak-8 Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 500,
    "maintenance": 22.5,
    "range": 70,
    "accuracy": 85,
    "color": "#f59e0b",
    "owned": 4,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "4",
    "name": "Akash-NG Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 480,
    "maintenance": 21.6,
    "range": 80,
    "accuracy": 85,
    "color": "#f59e0b",
    "owned": 6,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "5",
    "name": "Akash SAM Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 350,
    "maintenance": 15.8,
    "range": 30,
    "accuracy": 75,
    "color": "#f59e0b",
    "owned": 4,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "6",
    "name": "Pechora-2M SAM Battery",
    "category": "MEDIUM_RANGE",
    "cost": 15,
    "maintenance": 0.7,
    "range": 35,
    "accuracy": 72,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "7",
    "name": "SPYDER SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 50,
    "maintenance": 2.3,
    "range": 50,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 2,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "8",
    "name": "QRSAM Regiment",
    "category": "SHORT_RANGE",
    "cost": 600,
    "maintenance": 27,
    "range": 30,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 8,
    "maxLevel": 5,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "9",
    "name": "VSHORAD MANPADS Team",
    "category": "VERY_SHORT_RANGE",
    "cost": 0.15,
    "maintenance": 0,
    "range": 6.5,
    "accuracy": 85,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "10",
    "name": "Igla-S MANPADS Team",
    "category": "VERY_SHORT_RANGE",
    "cost": 1,
    "maintenance": 0,
    "range": 6,
    "accuracy": 80,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "11",
    "name": "Arudhra AESA Radar Station",
    "category": "RADAR",
    "cost": 100,
    "maintenance": 4.5,
    "range": 500,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 0,
    "maxLevel": 3,
    "country": "india",
    "isIndian": true
  },
  {
    "id": "12",
    "name": "HQ-9P HIMADS Regiment",
    "category": "LONG_RANGE",
    "cost": 350,
    "maintenance": 15.8,
    "range": 200,
    "accuracy": 88,
    "color": "#ef4444",
    "owned": 1,
    "maxLevel": 5,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "13",
    "name": "LY-80 LOMADS Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 120,
    "maintenance": 5.4,
    "range": 70,
    "accuracy": 82,
    "color": "#f59e0b",
    "owned": 2,
    "maxLevel": 5,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "14",
    "name": "HQ-17AE SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 40,
    "maintenance": 1.8,
    "range": 20,
    "accuracy": 85,
    "color": "#00ff88",
    "owned": 2,
    "maxLevel": 5,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "15",
    "name": "Spada 2000 SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 35,
    "maintenance": 1.6,
    "range": 25,
    "accuracy": 80,
    "color": "#00ff88",
    "owned": 3,
    "maxLevel": 5,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "16",
    "name": "FM-90 SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 20,
    "maintenance": 0.9,
    "range": 15,
    "accuracy": 75,
    "color": "#00ff88",
    "owned": 4,
    "maxLevel": 5,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "17",
    "name": "Anza Mk-III MANPADS Team",
    "category": "VERY_SHORT_RANGE",
    "cost": 0.8,
    "maintenance": 0,
    "range": 6,
    "accuracy": 68,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "18",
    "name": "TPS-77 Radar Station",
    "category": "RADAR",
    "cost": 20,
    "maintenance": 0.9,
    "range": 450,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 2,
    "maxLevel": 3,
    "country": "pakistan",
    "isIndian": false
  },
  {
    "id": "19",
    "name": "Patriot PAC-3 MSE Battery",
    "category": "LONG_RANGE",
    "cost": 1000,
    "maintenance": 45,
    "range": 160,
    "accuracy": 93,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "20",
    "name": "NASAMS III Battery",
    "category": "MEDIUM_RANGE",
    "cost": 250,
    "maintenance": 11.3,
    "range": 50,
    "accuracy": 90,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "21",
    "name": "THAAD Battery",
    "category": "LONG_RANGE",
    "cost": 3000,
    "maintenance": 135,
    "range": 200,
    "accuracy": 97,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "22",
    "name": "Avenger SHORAD Battery",
    "category": "SHORT_RANGE",
    "cost": 5,
    "maintenance": 0.2,
    "range": 8,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "23",
    "name": "Iron Dome Battery (US-acquired)",
    "category": "SHORT_RANGE",
    "cost": 100,
    "maintenance": 4.5,
    "range": 70,
    "accuracy": 90,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "24",
    "name": "AN/TPY-2 Radar Station",
    "category": "RADAR",
    "cost": 200,
    "maintenance": 9,
    "range": 1800,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 0,
    "maxLevel": 3,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "25",
    "name": "HQ-9B Regiment",
    "category": "LONG_RANGE",
    "cost": 500,
    "maintenance": 22.5,
    "range": 260,
    "accuracy": 90,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "26",
    "name": "HQ-22 MRSAM Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 200,
    "maintenance": 9,
    "range": 170,
    "accuracy": 87,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "27",
    "name": "HQ-17A SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 45,
    "maintenance": 2,
    "range": 20,
    "accuracy": 85,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "28",
    "name": "PGZ-09 SPAAA Battery",
    "category": "VERY_SHORT_RANGE",
    "cost": 5,
    "maintenance": 0.2,
    "range": 4,
    "accuracy": 72,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "29",
    "name": "YLC-2V Radar Station",
    "category": "RADAR",
    "cost": 30,
    "maintenance": 1.3,
    "range": 500,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 0,
    "maxLevel": 3,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "30b",
    "name": "S-400 Triumf Regiment",
    "category": "LONG_RANGE",
    "cost": 1090,
    "maintenance": 49,
    "range": 400,
    "accuracy": 92,
    "color": "#dc2626",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "30",
    "name": "S-500 Prometey Regiment",
    "category": "LONG_RANGE",
    "cost": 1500,
    "maintenance": 67.5,
    "range": 600,
    "accuracy": 95,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "31",
    "name": "S-350E Vityaz Regiment",
    "category": "MEDIUM_RANGE",
    "cost": 400,
    "maintenance": 18,
    "range": 120,
    "accuracy": 90,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "32",
    "name": "Pantsir-S1 Battery",
    "category": "SHORT_RANGE",
    "cost": 14,
    "maintenance": 0.6,
    "range": 20,
    "accuracy": 88,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "33",
    "name": "Tor-M2 SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 25,
    "maintenance": 1.1,
    "range": 16,
    "accuracy": 86,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "34",
    "name": "55G6 Tall Rack Radar Station",
    "category": "RADAR",
    "cost": 40,
    "maintenance": 1.8,
    "range": 600,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 0,
    "maxLevel": 3,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "35",
    "name": "Patriot PAC-3 MSE Battery (JASDF)",
    "category": "LONG_RANGE",
    "cost": 1000,
    "maintenance": 45,
    "range": 160,
    "accuracy": 93,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "36",
    "name": "Type-03 Chū-SAM Battery",
    "category": "MEDIUM_RANGE",
    "cost": 100,
    "maintenance": 4.5,
    "range": 90,
    "accuracy": 87,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "37",
    "name": "Type-11 SAM Battery",
    "category": "SHORT_RANGE",
    "cost": 15,
    "maintenance": 0.7,
    "range": 10,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "38",
    "name": "FPS-3 Radar Station",
    "category": "RADAR",
    "cost": 50,
    "maintenance": 2.3,
    "range": 600,
    "accuracy": 0,
    "color": "#6366f1",
    "owned": 0,
    "maxLevel": 3,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "39",
    "name": "Patriot PAC-3 Battery (ROKAF)",
    "category": "LONG_RANGE",
    "cost": 1000,
    "maintenance": 45,
    "range": 160,
    "accuracy": 93,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "south_korea",
    "isIndian": false
  },
  {
    "id": "40",
    "name": "Cheongung-II M-SAM Battery",
    "category": "MEDIUM_RANGE",
    "cost": 100,
    "maintenance": 4.5,
    "range": 40,
    "accuracy": 88,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "south_korea",
    "isIndian": false
  },
  {
    "id": "41",
    "name": "Chun Ma II Short-Range SAM",
    "category": "SHORT_RANGE",
    "cost": 10,
    "maintenance": 0.4,
    "range": 10,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "south_korea",
    "isIndian": false
  },
  {
    "id": "42",
    "name": "Sky Sabre (CAMM-ER) Battery",
    "category": "LONG_RANGE",
    "cost": 200,
    "maintenance": 9,
    "range": 45,
    "accuracy": 91,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "43",
    "name": "Land Ceptor CAMM Battery",
    "category": "MEDIUM_RANGE",
    "cost": 80,
    "maintenance": 3.6,
    "range": 25,
    "accuracy": 89,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "44",
    "name": "Rapier FSC Battery",
    "category": "SHORT_RANGE",
    "cost": 8,
    "maintenance": 0.4,
    "range": 8,
    "accuracy": 78,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "45",
    "name": "Starstreak HVM Team",
    "category": "VERY_SHORT_RANGE",
    "cost": 0.5,
    "maintenance": 0,
    "range": 7,
    "accuracy": 87,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "46",
    "name": "SAMP/T (Aster 30) Battery",
    "category": "LONG_RANGE",
    "cost": 500,
    "maintenance": 22.5,
    "range": 120,
    "accuracy": 90,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "47",
    "name": "VL MICA Battery",
    "category": "MEDIUM_RANGE",
    "cost": 50,
    "maintenance": 2.3,
    "range": 25,
    "accuracy": 88,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "48",
    "name": "Crotale NG Battery",
    "category": "SHORT_RANGE",
    "cost": 20,
    "maintenance": 0.9,
    "range": 11,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "49",
    "name": "Mistral VSHORAD Team",
    "category": "VERY_SHORT_RANGE",
    "cost": 0.3,
    "maintenance": 0,
    "range": 6,
    "accuracy": 85,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "50",
    "name": "IRIS-T SLX Regiment",
    "category": "LONG_RANGE",
    "cost": 500,
    "maintenance": 22.5,
    "range": 80,
    "accuracy": 91,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "germany",
    "isIndian": false
  },
  {
    "id": "51",
    "name": "IRIS-T SLM Battery",
    "category": "MEDIUM_RANGE",
    "cost": 150,
    "maintenance": 6.8,
    "range": 40,
    "accuracy": 90,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "germany",
    "isIndian": false
  },
  {
    "id": "52",
    "name": "Ozelot VSHORAD Battery",
    "category": "VERY_SHORT_RANGE",
    "cost": 3,
    "maintenance": 0.1,
    "range": 6,
    "accuracy": 82,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "germany",
    "isIndian": false
  },
  {
    "id": "53",
    "name": "IRIS-T SLS Short Battery",
    "category": "SHORT_RANGE",
    "cost": 20,
    "maintenance": 0.9,
    "range": 12,
    "accuracy": 88,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "germany",
    "isIndian": false
  },
  {
    "id": "54",
    "name": "Aegis Ashore (SM-3 Battery)",
    "category": "LONG_RANGE",
    "cost": 1200,
    "maintenance": 54,
    "range": 1200,
    "accuracy": 95,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "55",
    "name": "LPWS C-RAM (Centurion)",
    "category": "VERY_SHORT_RANGE",
    "cost": 15,
    "maintenance": 0.7,
    "range": 2,
    "accuracy": 88,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "usa",
    "isIndian": false
  },
  {
    "id": "56",
    "name": "HQ-19 ABM System",
    "category": "LONG_RANGE",
    "cost": 1000,
    "maintenance": 45,
    "range": 400,
    "accuracy": 95,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "57",
    "name": "LD-2000 C-RAM SPAAG",
    "category": "VERY_SHORT_RANGE",
    "cost": 12,
    "maintenance": 0.5,
    "range": 3,
    "accuracy": 85,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "china",
    "isIndian": false
  },
  {
    "id": "58",
    "name": "Gibka-S Mobile VSHORAD",
    "category": "VERY_SHORT_RANGE",
    "cost": 2,
    "maintenance": 0.1,
    "range": 6,
    "accuracy": 80,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "59",
    "name": "Sosna-R Short-Range SAM",
    "category": "SHORT_RANGE",
    "cost": 10,
    "maintenance": 0.4,
    "range": 10,
    "accuracy": 88,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "russia",
    "isIndian": false
  },
  {
    "id": "60",
    "name": "Type-03 Chū-SAM Kai",
    "category": "MEDIUM_RANGE",
    "cost": 220,
    "maintenance": 9.9,
    "range": 120,
    "accuracy": 90,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "61",
    "name": "Type-81 Short Range SAM",
    "category": "SHORT_RANGE",
    "cost": 15,
    "maintenance": 0.7,
    "range": 10,
    "accuracy": 82,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "japan",
    "isIndian": false
  },
  {
    "id": "62",
    "name": "L-SAM ABM System",
    "category": "LONG_RANGE",
    "cost": 600,
    "maintenance": 27,
    "range": 150,
    "accuracy": 90,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "south_korea",
    "isIndian": false
  },
  {
    "id": "63",
    "name": "LAMD (Low Altitude Missile Defense)",
    "category": "SHORT_RANGE",
    "cost": 40,
    "maintenance": 1.8,
    "range": 7,
    "accuracy": 88,
    "color": "#00ff88",
    "owned": 0,
    "maxLevel": 5,
    "country": "south_korea",
    "isIndian": false
  },
  {
    "id": "64",
    "name": "Aegis Destroyer (SM-6 Type-45)",
    "category": "LONG_RANGE",
    "cost": 800,
    "maintenance": 36,
    "range": 240,
    "accuracy": 92,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "65",
    "name": "Starstreak LML (VSHORAD)",
    "category": "VERY_SHORT_RANGE",
    "cost": 2,
    "maintenance": 0.1,
    "range": 7,
    "accuracy": 88,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "uk",
    "isIndian": false
  },
  {
    "id": "66",
    "name": "VL MICA NG (Next-Generation)",
    "category": "MEDIUM_RANGE",
    "cost": 100,
    "maintenance": 4.5,
    "range": 40,
    "accuracy": 90,
    "color": "#f59e0b",
    "owned": 0,
    "maxLevel": 5,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "67",
    "name": "Mistral Atlas Mobile VSHORAD",
    "category": "VERY_SHORT_RANGE",
    "cost": 1.5,
    "maintenance": 0.1,
    "range": 7.5,
    "accuracy": 85,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "france",
    "isIndian": false
  },
  {
    "id": "68",
    "name": "Arrow 3 ABM System (German-acquired)",
    "category": "LONG_RANGE",
    "cost": 1200,
    "maintenance": 54,
    "range": 250,
    "accuracy": 97,
    "color": "#ef4444",
    "owned": 0,
    "maxLevel": 5,
    "country": "germany",
    "isIndian": false
  },
  {
    "id": "69",
    "name": "Mantis C-RAM Gun System",
    "category": "VERY_SHORT_RANGE",
    "cost": 25,
    "maintenance": 1.1,
    "range": 3,
    "accuracy": 88,
    "color": "#00b4d8",
    "owned": 0,
    "maxLevel": 3,
    "country": "germany",
    "isIndian": false
  }
];

const TECH_TREE = [
  { level: 1, name: 'Basic Systems', unlocked: true, systems: ['Igla-S', 'VSHORAD MANPAD', 'OSA-AKM'], color: '#4b5563' },
  { level: 2, name: 'Modern SHORAD', unlocked: true, systems: ['QRSAM Regiment', 'SPYDER SAM Battery', 'Mistral'], color: '#00b4d8' },
  { level: 3, name: 'Medium Range', unlocked: true, systems: ['Akash SAM', 'Pechora-2M', 'Akash-NG', 'MRSAM', 'Barak 8 ER'], color: '#f59e0b' },
  { level: 4, name: 'Long Range', unlocked: true, systems: ['S-400 Triumf Regiment'], color: '#ef4444' },
  { level: 5, name: 'Future Tech', unlocked: false, systems: ['Directed Energy', 'Hypersonic Interceptor', 'AI Command'], color: '#a855f7' },
];

const COUNTRY_META = {
  "india": {
    "label": "India",
    "flag": "🇮🇳",
    "color": "#00b4d8",
    "defColor": "#00b4d8"
  },
  "pakistan": {
    "label": "Pakistan",
    "flag": "🇵🇰",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "usa": {
    "label": "USA",
    "flag": "🇺🇸",
    "color": "#3b82f6",
    "defColor": "#3b82f6"
  },
  "china": {
    "label": "China",
    "flag": "🇨🇳",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "russia": {
    "label": "Russia",
    "flag": "🇷🇺",
    "color": "#dc2626",
    "defColor": "#dc2626"
  },
  "japan": {
    "label": "Japan",
    "flag": "🇯🇵",
    "color": "#f97316",
    "defColor": "#f97316"
  },
  "south_korea": {
    "label": "South Korea",
    "flag": "🇰🇷",
    "color": "#22d3ee",
    "defColor": "#22d3ee"
  },
  "uk": {
    "label": "UK",
    "flag": "🇬🇧",
    "color": "#6366f1",
    "defColor": "#6366f1"
  },
  "france": {
    "label": "France",
    "flag": "🇫🇷",
    "color": "#a78bfa",
    "defColor": "#a78bfa"
  },
  "germany": {
    "label": "Germany",
    "flag": "🇩🇪",
    "color": "#facc15",
    "defColor": "#facc15"
  }
};

export default function ProcurementPage() {
  const [tab, setTab] = useState<'catalog' | 'owned' | 'tech'>('catalog');
  const [countryTab, setCountryTab] = useState<string>('india');
  const totalSpent = CATALOG.reduce((s, c) => s + c.cost * c.owned, 0);
  const yearlyMaintenance = CATALOG.reduce((s, c) => s + c.maintenance * c.owned, 0);

  const displayCatalog = CATALOG.filter(c => c.country === countryTab);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">🛒 Procurement Center</h1>
        <p className="text-sm text-[#6b7280]">Purchase, upgrade, and manage air defence systems</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#00ff88' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Total Invested</div>
          <div className="text-xl font-bold text-[#00ff88] font-mono">${totalSpent.toFixed(0)}M</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Yearly Maintenance</div>
          <div className="text-xl font-bold text-[#f59e0b] font-mono">${yearlyMaintenance.toFixed(1)}M</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#00b4d8' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Systems Owned</div>
          <div className="text-xl font-bold text-[#00b4d8] font-mono">{CATALOG.reduce((s, c) => s + c.owned, 0)}</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#a855f7' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Available Budget</div>
          <div className="text-xl font-bold text-[#a855f7] font-mono">$2,500M</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {([['catalog', '📦 Catalog'], ['owned', '🗂️ My Systems'], ['tech', '🔬 Tech Tree']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' : 'text-[#6b7280] hover:text-white'
            }`}>{label}</button>
          ))}
        </div>

        {/* Section Tabs */}
        {(tab === 'catalog' || tab === 'owned') && (
          <div className="flex gap-1 bg-white/[0.02] border border-white/5 p-0.5 rounded-lg">
            {Object.keys(COUNTRY_META).map(cid => {
              const meta = COUNTRY_META[cid as keyof typeof COUNTRY_META];
              return (
                <button
                  key={cid}
                  onClick={() => setCountryTab(cid)}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                    countryTab === cid
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-[#6b7280] hover:text-white'
                  }`}
                >
                  {meta.flag} {meta.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Catalog */}
      {tab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {displayCatalog.map(sys => (
            <div key={sys.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{sys.name}</h3>
                  <span className="badge text-[9px] mt-1" style={{ backgroundColor: `${sys.color}22`, color: sys.color, border: `1px solid ${sys.color}44` }}>{sys.category.replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00ff88] font-mono">${sys.cost}M</div>
                  <div className="text-[10px] text-[#4b5563]">+${sys.maintenance}M/yr</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-[#4b5563]">Range:</span> <span className="font-mono text-[#e5e7eb]">{sys.range}km</span></div>
                <div><span className="text-[#4b5563]">Accuracy:</span> <span className="font-mono text-[#e5e7eb]">{sys.accuracy}%</span></div>
                <div><span className="text-[#4b5563]">Owned:</span> <span className="font-mono text-[#e5e7eb]">{sys.owned}</span></div>
                <div><span className="text-[#4b5563]">Max Level:</span> <span className="font-mono text-[#e5e7eb]">{sys.maxLevel}</span></div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs py-1.5 flex-1">Purchase</button>
                <button className="btn-secondary text-xs py-1.5 flex-1">Upgrade</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owned */}
      {tab === 'owned' && (
        <div className="card overflow-hidden animate-fade-in-up">
          <table className="data-table">
            <thead><tr><th>System</th><th>Category</th><th>Owned</th><th>Total Cost</th><th>Yearly Maintenance</th><th>Status</th></tr></thead>
            <tbody>
              {displayCatalog.filter(c => c.owned > 0).map(sys => (
                <tr key={sys.id}>
                  <td className="font-medium text-white">{sys.name}</td>
                  <td><span className="badge text-[10px]" style={{ backgroundColor: `${sys.color}22`, color: sys.color, border: `1px solid ${sys.color}44` }}>{sys.category.replace('_', ' ')}</span></td>
                  <td className="font-mono">{sys.owned}</td>
                  <td className="font-mono text-[#00ff88]">${(sys.cost * sys.owned).toFixed(1)}M</td>
                  <td className="font-mono text-[#f59e0b]">${(sys.maintenance * sys.owned).toFixed(1)}M</td>
                  <td><span className="badge badge-green text-[10px]">OPERATIONAL</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tech Tree */}
      {tab === 'tech' && (
        <div className="space-y-4 animate-fade-in-up">
          {TECH_TREE.map((level, i) => (
            <div key={level.level} className={`card p-5 ${!level.unlocked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  level.unlocked ? 'bg-gradient-to-br from-[#00ff88]/20 to-[#00b4d8]/20 text-[#00ff88]' : 'bg-[#1f2937] text-[#4b5563]'
                }`}>
                  {level.unlocked ? `L${level.level}` : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold" style={{ color: level.color }}>{level.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {level.systems.map(sys => (
                      <span key={sys} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#9ca3af]">{sys}</span>
                    ))}
                  </div>
                </div>
                {!level.unlocked && <button className="btn-secondary text-xs">Research — $100M</button>}
              </div>
              {i < TECH_TREE.length - 1 && <div className="ml-6 mt-3 w-px h-4 bg-white/10" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
