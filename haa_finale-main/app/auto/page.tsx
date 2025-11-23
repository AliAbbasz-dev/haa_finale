"use client";

import {
  useMemo,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Wrench,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  ChevronRight,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Variants } from "framer-motion";

const flyoutVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" as const }
  }
};

const listStagger: Variants = {
  initial: { transition: { staggerChildren: 0.0 } },
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } }
};

const itemFade: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" as const } }
};

// ---------------- Framer Motion variants ----------------


const gridStagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------

// Auto page hero images (add/remove paths as needed)
const autoHeroImages: ReadonlyArray<string> = [
  "/carousels/vehicles-1.png",
  "/carousels/vehicles-2.png",
  "/carousels/vehicles-3.png",
  "/carousels/vehicles-4.png",
  "/carousels/vehicles-5.png",
  "/carousels/vehicles-6.png",
  "/carousels/vehicles-7.png",
  "/carousels/vehicles-8.png",
  "/carousels/vehicles-9.png",
  "/carousels/vehicles-10.png",
  "/carousels/vehicles-11.png",
  "/carousels/vehicles-12.png",
];

// Demo catalog
const CATALOG: ReadonlyArray<{
  id: string;
  make: string;
  model: string;
  bodyType: string;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  transmission: "Manual" | "Automatic";
  year: number;
  price: number; // GBP
  mileage: number; // miles
  image: string;
}> = [
  // CONVERTIBLES
  { id: "cv1", make: "Mazda", model: "MX-5", bodyType: "Convertible", fuel: "Petrol", transmission: "Manual", year: 2020, price: 18995, mileage: 25000, image: "/carousels/vehicles-6.png" },

  // PICKUP TRUCKS
  { id: "pt1", make: "Ford", model: "Ranger", bodyType: "Pickup Truck", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 28950, mileage: 15000, image: "/carousels/vehicles-5.png" },
  { id: "pt2", make: "Mitsubishi", model: "L200", bodyType: "Pickup Truck", fuel: "Diesel", transmission: "Manual", year: 2021, price: 24995, mileage: 22000, image: "/carousels/vehicles-5.png" },
  { id: "pt3", make: "Nissan", model: "Navara", bodyType: "Pickup Truck", fuel: "Diesel", transmission: "Automatic", year: 2020, price: 22995, mileage: 30000, image: "/carousels/vehicles-5.png" },

  // COUPES
  { id: "cp1", make: "Audi", model: "A5", bodyType: "Coupe", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 32995, mileage: 12000, image: "/carousels/vehicles-1.png" },
  { id: "cp2", make: "Audi", model: "TT Coupe", bodyType: "Coupe", fuel: "Petrol", transmission: "Automatic", year: 2021, price: 34995, mileage: 18000, image: "/carousels/vehicles-1.png" },
  { id: "cp3", make: "BMW", model: "4 Series", bodyType: "Coupe", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 37995, mileage: 8000, image: "/carousels/vehicles-1.png" },
  { id: "cp4", make: "Porsche", model: "911", bodyType: "Coupe", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 89995, mileage: 5000, image: "/carousels/vehicles-1.png" },
  { id: "cp5", make: "Porsche", model: "Cayenne", bodyType: "Coupe", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 69995, mileage: 6000, image: "/carousels/vehicles-1.png" },

  // MPVs
  { id: "mpv1", make: "BMW", model: "2 Series", bodyType: "MPV", fuel: "Petrol", transmission: "Automatic", year: 2021, price: 24995, mileage: 20000, image: "/carousels/vehicles-7.png" },
  { id: "mpv2", make: "Ford", model: "C-MAX", bodyType: "MPV", fuel: "Diesel", transmission: "Manual", year: 2019, price: 12995, mileage: 45000, image: "/carousels/vehicles-7.png" },
  { id: "mpv3", make: "Mitsubishi", model: "Outlander", bodyType: "MPV", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 29995, mileage: 15000, image: "/carousels/vehicles-7.png" },
  { id: "mpv4", make: "Vauxhall", model: "Mokka X", bodyType: "MPV", fuel: "Diesel", transmission: "Manual", year: 2020, price: 14995, mileage: 35000, image: "/carousels/vehicles-7.png" },
  { id: "mpv5", make: "Vauxhall", model: "Zafira Tourer", bodyType: "MPV", fuel: "Diesel", transmission: "Manual", year: 2018, price: 8995, mileage: 60000, image: "/carousels/vehicles-7.png" },

  // SALOONS
  { id: "sal1", make: "Audi", model: "A4", bodyType: "Saloon", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 27995, mileage: 14000, image: "/carousels/vehicles-1.png" },
  { id: "sal2", make: "Audi", model: "A6 Saloon", bodyType: "Saloon", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 34995, mileage: 18000, image: "/carousels/vehicles-1.png" },
  { id: "sal3", make: "BMW", model: "3 Series", bodyType: "Saloon", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 31995, mileage: 10000, image: "/carousels/vehicles-1.png" },
  { id: "sal4", make: "BMW", model: "5 Series", bodyType: "Saloon", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 39995, mileage: 12000, image: "/carousels/vehicles-1.png" },
  { id: "sal5", make: "Jaguar", model: "XF", bodyType: "Saloon", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 31995, mileage: 20000, image: "/carousels/vehicles-1.png" },
  { id: "sal6", make: "Mercedes-Benz", model: "C-Class", bodyType: "Saloon", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 32995, mileage: 13000, image: "/carousels/vehicles-10.png" },
  { id: "sal7", make: "Mercedes-Benz", model: "CLA", bodyType: "Saloon", fuel: "Petrol", transmission: "Automatic", year: 2021, price: 28995, mileage: 16000, image: "/carousels/vehicles-10.png" },
  { id: "sal8", make: "Mercedes-Benz", model: "E-Class", bodyType: "Saloon", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 42995, mileage: 11000, image: "/carousels/vehicles-10.png" },
  { id: "sal9", make: "Tesla", model: "Model 3", bodyType: "Saloon", fuel: "Electric", transmission: "Automatic", year: 2024, price: 39995, mileage: 3000, image: "/carousels/vehicles-4.png" },

  // ESTATES
  { id: "est1", make: "Audi", model: "A4 Avant", bodyType: "Estate", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 28995, mileage: 14000, image: "/carousels/vehicles-1.png" },
  { id: "est2", make: "Ford", model: "Focus", bodyType: "Estate", fuel: "Diesel", transmission: "Manual", year: 2020, price: 15995, mileage: 30000, image: "/carousels/vehicles-2.png" },
  { id: "est3", make: "Ford", model: "Mondeo", bodyType: "Estate", fuel: "Diesel", transmission: "Automatic", year: 2019, price: 14995, mileage: 40000, image: "/carousels/vehicles-2.png" },
  { id: "est4", make: "MINI", model: "Mini Clubman", bodyType: "Estate", fuel: "Petrol", transmission: "Manual", year: 2021, price: 19995, mileage: 25000, image: "/carousels/vehicles-2.png" },
  { id: "est5", make: "Seat", model: "Leon", bodyType: "Estate", fuel: "Diesel", transmission: "Manual", year: 2020, price: 13995, mileage: 35000, image: "/carousels/vehicles-2.png" },
  { id: "est6", make: "Skoda", model: "Superb", bodyType: "Estate", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 21995, mileage: 28000, image: "/carousels/vehicles-2.png" },
  { id: "est7", make: "Toyota", model: "Auris", bodyType: "Estate", fuel: "Hybrid", transmission: "Automatic", year: 2019, price: 14995, mileage: 45000, image: "/carousels/vehicles-3.png" },
  { id: "est8", make: "Volkswagen", model: "Passat", bodyType: "Estate", fuel: "Diesel", transmission: "Automatic", year: 2020, price: 19995, mileage: 32000, image: "/carousels/vehicles-9.png" },
  { id: "est9", make: "Volvo", model: "XC60", bodyType: "Estate", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 34995, mileage: 15000, image: "/carousels/vehicles-7.png" },
  { id: "est10", make: "Volvo", model: "XC90", bodyType: "Estate", fuel: "Hybrid", transmission: "Automatic", year: 2023, price: 49995, mileage: 8000, image: "/carousels/vehicles-7.png" },

  // VANS
  { id: "van1", make: "Citroen", model: "Berlingo", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 14995, mileage: 25000, image: "/carousels/vehicles-5.png" },
  { id: "van2", make: "Citroen", model: "Relay", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2020, price: 18995, mileage: 35000, image: "/carousels/vehicles-5.png" },
  { id: "van3", make: "Ford", model: "Transit Connect", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2022, price: 19995, mileage: 12000, image: "/carousels/vehicles-5.png" },
  { id: "van4", make: "Ford", model: "Transit Custom", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 22995, mileage: 20000, image: "/carousels/vehicles-5.png" },
  { id: "van5", make: "Ford", model: "Transit", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2020, price: 24995, mileage: 30000, image: "/carousels/vehicles-5.png" },
  { id: "van6", make: "Mercedes-Benz", model: "Sprinter", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2022, price: 27995, mileage: 15000, image: "/carousels/vehicles-5.png" },
  { id: "van7", make: "Peugeot", model: "Boxer", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 19995, mileage: 25000, image: "/carousels/vehicles-5.png" },
  { id: "van8", make: "Peugeot", model: "Partner", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2020, price: 12995, mileage: 40000, image: "/carousels/vehicles-5.png" },
  { id: "van9", make: "Renault", model: "Trafic", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 18995, mileage: 28000, image: "/carousels/vehicles-5.png" },
  { id: "van10", make: "Vauxhall", model: "Combo", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2022, price: 14995, mileage: 18000, image: "/carousels/vehicles-5.png" },
  { id: "van11", make: "Vauxhall", model: "Vivaro", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 19995, mileage: 22000, image: "/carousels/vehicles-5.png" },
  { id: "van12", make: "Volkswagen", model: "Caddy", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2022, price: 17995, mileage: 16000, image: "/carousels/vehicles-5.png" },
  { id: "van13", make: "Volkswagen", model: "Transporter", bodyType: "Van", fuel: "Diesel", transmission: "Manual", year: 2021, price: 24995, mileage: 20000, image: "/carousels/vehicles-5.png" },

  // SUVs/CROSSOVERS
  { id: "suv1", make: "Audi", model: "Q7", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 49995, mileage: 12000, image: "/carousels/vehicles-7.png" },
  { id: "suv2", make: "BMW", model: "X1", bodyType: "SUV", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 31995, mileage: 8000, image: "/carousels/vehicles-7.png" },
  { id: "suv3", make: "BMW", model: "X3", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 37995, mileage: 14000, image: "/carousels/vehicles-7.png" },
  { id: "suv4", make: "BMW", model: "X5", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 54995, mileage: 7000, image: "/carousels/vehicles-7.png" },
  { id: "suv5", make: "Citroen", model: "C3 Aircross", bodyType: "SUV", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 25000, image: "/carousels/vehicles-7.png" },
  { id: "suv6", make: "Citroen", model: "C5 Aircross", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 22995, mileage: 18000, image: "/carousels/vehicles-7.png" },
  { id: "suv7", make: "Dacia", model: "Duster", bodyType: "SUV", fuel: "Petrol", transmission: "Manual", year: 2020, price: 9995, mileage: 40000, image: "/carousels/vehicles-7.png" },
  { id: "suv8", make: "Ford", model: "Kuga", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 24995, mileage: 22000, image: "/carousels/vehicles-7.png" },
  { id: "suv9", make: "Honda", model: "CR-V", bodyType: "SUV", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 29995, mileage: 15000, image: "/carousels/vehicles-7.png" },
  { id: "suv10", make: "Honda", model: "HR-V", bodyType: "SUV", fuel: "Petrol", transmission: "Manual", year: 2021, price: 19995, mileage: 28000, image: "/carousels/vehicles-7.png" },
  { id: "suv11", make: "Jaguar", model: "F-PACE", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 44995, mileage: 13000, image: "/carousels/vehicles-7.png" },
  { id: "suv12", make: "Kia", model: "Sportage", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 26995, mileage: 9000, image: "/carousels/vehicles-7.png" },
  { id: "suv13", make: "Land Rover", model: "110 Defender", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 59995, mileage: 5000, image: "/carousels/vehicles-7.png" },
  { id: "suv14", make: "Land Rover", model: "90 Defender", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 54995, mileage: 10000, image: "/carousels/vehicles-7.png" },
  { id: "suv15", make: "Land Rover", model: "Discovery Sport", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 34995, mileage: 12000, image: "/carousels/vehicles-7.png" },
  { id: "suv16", make: "Land Rover", model: "Discovery", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 49995, mileage: 8000, image: "/carousels/vehicles-7.png" },
  { id: "suv17", make: "Land Rover", model: "Range Rover Sport", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 69995, mileage: 6000, image: "/carousels/vehicles-7.png" },
  { id: "suv18", make: "Land Rover", model: "Range Rover Velar", bodyType: "SUV", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 54995, mileage: 11000, image: "/carousels/vehicles-7.png" },
  { id: "suv19", make: "Land Rover", model: "Range Rover", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2024, price: 89995, mileage: 3000, image: "/carousels/vehicles-7.png" },
  { id: "suv20", make: "Mazda", model: "CX-5", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 24995, mileage: 20000, image: "/carousels/vehicles-7.png" },
  { id: "suv21", make: "Mercedes-Benz", model: "GLA-Class", bodyType: "SUV", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 29995, mileage: 14000, image: "/carousels/vehicles-7.png" },
  { id: "suv22", make: "Mercedes-Benz", model: "GLC-Class", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 39995, mileage: 9000, image: "/carousels/vehicles-7.png" },
  { id: "suv23", make: "Nissan", model: "X-Trail", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 22995, mileage: 26000, image: "/carousels/vehicles-7.png" },
  { id: "suv24", make: "Seat", model: "Ateca", bodyType: "SUV", fuel: "Diesel", transmission: "Manual", year: 2020, price: 18995, mileage: 35000, image: "/carousels/vehicles-7.png" },
  { id: "suv25", make: "Toyota", model: "RAV4", bodyType: "SUV", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 28995, mileage: 16000, image: "/carousels/vehicles-7.png" },
  { id: "suv26", make: "Volkswagen", model: "Tiguan", bodyType: "SUV", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 26995, mileage: 24000, image: "/carousels/vehicles-7.png" },

  // HATCHBACKS
  { id: "hb1", make: "Audi", model: "A1", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 19995, mileage: 17000, image: "/carousels/vehicles-2.png" },
  { id: "hb2", make: "Audi", model: "A3", bodyType: "Hatchback", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 24995, mileage: 10000, image: "/carousels/vehicles-2.png" },
  { id: "hb3", make: "Audi", model: "Q2", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 22995, mileage: 21000, image: "/carousels/vehicles-2.png" },
  { id: "hb4", make: "Audi", model: "Q3", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 29995, mileage: 15000, image: "/carousels/vehicles-2.png" },
  { id: "hb5", make: "Audi", model: "Q5", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2023, price: 39995, mileage: 8000, image: "/carousels/vehicles-2.png" },
  { id: "hb6", make: "BMW", model: "1 Series", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 22995, mileage: 16000, image: "/carousels/vehicles-2.png" },
  { id: "hb7", make: "Citroen", model: "C1", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 6995, mileage: 45000, image: "/carousels/vehicles-2.png" },
  { id: "hb8", make: "Citroen", model: "C3", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 11995, mileage: 30000, image: "/carousels/vehicles-2.png" },
  { id: "hb9", make: "Citroen", model: "C4", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2020, price: 13995, mileage: 38000, image: "/carousels/vehicles-2.png" },
  { id: "hb10", make: "Dacia", model: "Sandero Stepway", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 8995, mileage: 32000, image: "/carousels/vehicles-2.png" },
  { id: "hb11", make: "Fiat", model: "500", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 12995, mileage: 18000, image: "/carousels/vehicles-2.png" },
  { id: "hb12", make: "Fiat", model: "500X", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 25000, image: "/carousels/vehicles-2.png" },
  { id: "hb13", make: "Ford", model: "EcoSport", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 11995, mileage: 40000, image: "/carousels/vehicles-2.png" },
  { id: "hb14", make: "Ford", model: "Fiesta", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 14995, mileage: 20000, image: "/carousels/vehicles-2.png" },
  { id: "hb15", make: "Ford", model: "Puma SUV", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 17995, mileage: 28000, image: "/carousels/vehicles-2.png" },
  { id: "hb16", make: "Honda", model: "Civic", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 18995, mileage: 24000, image: "/carousels/vehicles-8.png" },
  { id: "hb17", make: "Honda", model: "Jazz", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 16995, mileage: 19000, image: "/carousels/vehicles-8.png" },
  { id: "hb18", make: "Hyundai", model: "IONIQ", bodyType: "Hatchback", fuel: "Electric", transmission: "Automatic", year: 2023, price: 24995, mileage: 7000, image: "/carousels/vehicles-2.png" },
  { id: "hb19", make: "Hyundai", model: "Kona", bodyType: "Hatchback", fuel: "Electric", transmission: "Automatic", year: 2022, price: 22995, mileage: 13000, image: "/carousels/vehicles-2.png" },
  { id: "hb20", make: "Hyundai", model: "Tucson", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2021, price: 24995, mileage: 26000, image: "/carousels/vehicles-2.png" },
  { id: "hb21", make: "Hyundai", model: "i10", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 8995, mileage: 42000, image: "/carousels/vehicles-2.png" },
  { id: "hb22", make: "Hyundai", model: "i20", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 11995, mileage: 31000, image: "/carousels/vehicles-2.png" },
  { id: "hb23", make: "Hyundai", model: "i30", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2020, price: 13995, mileage: 39000, image: "/carousels/vehicles-2.png" },
  { id: "hb24", make: "Kia", model: "Niro", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 21995, mileage: 17000, image: "/carousels/vehicles-2.png" },
  { id: "hb25", make: "Kia", model: "Picanto", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 9995, mileage: 29000, image: "/carousels/vehicles-2.png" },
  { id: "hb26", make: "Kia", model: "Rio", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 10995, mileage: 41000, image: "/carousels/vehicles-2.png" },
  { id: "hb27", make: "Kia", model: "Stonic", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 15995, mileage: 21000, image: "/carousels/vehicles-2.png" },
  { id: "hb28", make: "Kia", model: "XCeed", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 17995, mileage: 27000, image: "/carousels/vehicles-2.png" },
  { id: "hb29", make: "Kia", model: "ceed", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2020, price: 14995, mileage: 37000, image: "/carousels/vehicles-2.png" },
  { id: "hb30", make: "Kia", model: "e Niro", bodyType: "Hatchback", fuel: "Electric", transmission: "Automatic", year: 2023, price: 27995, mileage: 5000, image: "/carousels/vehicles-2.png" },
  { id: "hb31", make: "Land Rover", model: "Range Rover Evoque", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 37995, mileage: 14000, image: "/carousels/vehicles-7.png" },
  { id: "hb32", make: "MG", model: "HS", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 26000, image: "/carousels/vehicles-2.png" },
  { id: "hb33", make: "MG", model: "ZS SUV", bodyType: "Hatchback", fuel: "Electric", transmission: "Automatic", year: 2022, price: 19995, mileage: 18000, image: "/carousels/vehicles-2.png" },
  { id: "hb34", make: "MINI", model: "Mini Countryman", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 24995, mileage: 15000, image: "/carousels/vehicles-2.png" },
  { id: "hb35", make: "MINI", model: "Mini", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2023, price: 19995, mileage: 11000, image: "/carousels/vehicles-2.png" },
  { id: "hb36", make: "Mazda", model: "Mazda2", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 12995, mileage: 30000, image: "/carousels/vehicles-2.png" },
  { id: "hb37", make: "Mazda", model: "Mazda3", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 19995, mileage: 19000, image: "/carousels/vehicles-2.png" },
  { id: "hb38", make: "Mercedes-Benz", model: "A-Class", bodyType: "Hatchback", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 27995, mileage: 9000, image: "/carousels/vehicles-2.png" },
  { id: "hb39", make: "Mercedes-Benz", model: "B-Class", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2022, price: 24995, mileage: 16000, image: "/carousels/vehicles-2.png" },
  { id: "hb40", make: "Nissan", model: "Juke", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 16995, mileage: 28000, image: "/carousels/vehicles-2.png" },
  { id: "hb41", make: "Nissan", model: "Leaf", bodyType: "Hatchback", fuel: "Electric", transmission: "Automatic", year: 2023, price: 22995, mileage: 6000, image: "/carousels/vehicles-2.png" },
  { id: "hb42", make: "Nissan", model: "Micra", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 10995, mileage: 44000, image: "/carousels/vehicles-2.png" },
  { id: "hb43", make: "Nissan", model: "Qashqai", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2022, price: 21995, mileage: 17000, image: "/carousels/vehicles-2.png" },
  { id: "hb44", make: "Peugeot", model: "108", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 7995, mileage: 46000, image: "/carousels/vehicles-2.png" },
  { id: "hb45", make: "Peugeot", model: "2008 SUV", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 16995, mileage: 29000, image: "/carousels/vehicles-2.png" },
  { id: "hb46", make: "Peugeot", model: "208", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 14995, mileage: 20000, image: "/carousels/vehicles-2.png" },
  { id: "hb47", make: "Peugeot", model: "3008 SUV", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 22995, mileage: 25000, image: "/carousels/vehicles-2.png" },
  { id: "hb48", make: "Peugeot", model: "308", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2020, price: 13995, mileage: 40000, image: "/carousels/vehicles-2.png" },
  { id: "hb49", make: "Porsche", model: "Macan", bodyType: "Hatchback", fuel: "Petrol", transmission: "Automatic", year: 2023, price: 54995, mileage: 4000, image: "/carousels/vehicles-2.png" },
  { id: "hb50", make: "Renault", model: "Captur", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 30000, image: "/carousels/vehicles-2.png" },
  { id: "hb51", make: "Renault", model: "Clio", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 12995, mileage: 21000, image: "/carousels/vehicles-2.png" },
  { id: "hb52", make: "Renault", model: "Kadjar", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2020, price: 15995, mileage: 38000, image: "/carousels/vehicles-2.png" },
  { id: "hb53", make: "Renault", model: "Megane", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2021, price: 16995, mileage: 31000, image: "/carousels/vehicles-2.png" },
  { id: "hb54", make: "Seat", model: "Arona", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 29000, image: "/carousels/vehicles-2.png" },
  { id: "hb55", make: "Seat", model: "Ibiza", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 12995, mileage: 19000, image: "/carousels/vehicles-2.png" },
  { id: "hb56", make: "Skoda", model: "Fabia", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 11995, mileage: 32000, image: "/carousels/vehicles-2.png" },
  { id: "hb57", make: "Skoda", model: "Kamiq", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 17995, mileage: 18000, image: "/carousels/vehicles-2.png" },
  { id: "hb58", make: "Skoda", model: "Karoq", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 22995, mileage: 26000, image: "/carousels/vehicles-2.png" },
  { id: "hb59", make: "Skoda", model: "Octavia", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2022, price: 19995, mileage: 20000, image: "/carousels/vehicles-2.png" },
  { id: "hb60", make: "Suzuki", model: "Swift", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 12995, mileage: 22000, image: "/carousels/vehicles-2.png" },
  { id: "hb61", make: "Suzuki", model: "Vitara", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 16995, mileage: 27000, image: "/carousels/vehicles-2.png" },
  { id: "hb62", make: "Toyota", model: "AYGO", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 8995, mileage: 33000, image: "/carousels/vehicles-3.png" },
  { id: "hb63", make: "Toyota", model: "C-HR", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 23995, mileage: 16000, image: "/carousels/vehicles-3.png" },
  { id: "hb64", make: "Toyota", model: "Corolla", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2023, price: 22995, mileage: 12000, image: "/carousels/vehicles-3.png" },
  { id: "hb65", make: "Toyota", model: "Prius", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2023, price: 25995, mileage: 6500, image: "/carousels/vehicles-3.png" },
  { id: "hb66", make: "Toyota", model: "Yaris", bodyType: "Hatchback", fuel: "Hybrid", transmission: "Automatic", year: 2022, price: 15995, mileage: 23000, image: "/carousels/vehicles-3.png" },
  { id: "hb67", make: "Vauxhall", model: "ADAM", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2019, price: 7995, mileage: 50000, image: "/carousels/vehicles-2.png" },
  { id: "hb68", make: "Vauxhall", model: "Astra", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2021, price: 15995, mileage: 30000, image: "/carousels/vehicles-2.png" },
  { id: "hb69", make: "Vauxhall", model: "Corsa", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 12995, mileage: 21000, image: "/carousels/vehicles-2.png" },
  { id: "hb70", make: "Vauxhall", model: "Crossland X", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 13995, mileage: 36000, image: "/carousels/vehicles-2.png" },
  { id: "hb71", make: "Vauxhall", model: "Grandland X", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2021, price: 19995, mileage: 28000, image: "/carousels/vehicles-2.png" },
  { id: "hb72", make: "Vauxhall", model: "Insignia", bodyType: "Hatchback", fuel: "Diesel", transmission: "Automatic", year: 2020, price: 16995, mileage: 40000, image: "/carousels/vehicles-2.png" },
  { id: "hb73", make: "Vauxhall", model: "Mokka", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 29000, image: "/carousels/vehicles-2.png" },
  { id: "hb74", make: "Volkswagen", model: "Golf", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2022, price: 19995, mileage: 18000, image: "/carousels/vehicles-9.png" },
  { id: "hb75", make: "Volkswagen", model: "Polo", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2021, price: 14995, mileage: 27000, image: "/carousels/vehicles-9.png" },
  { id: "hb76", make: "Volkswagen", model: "T-Roc", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2022, price: 22995, mileage: 19000, image: "/carousels/vehicles-9.png" },
  { id: "hb77", make: "Volkswagen", model: "up!", bodyType: "Hatchback", fuel: "Petrol", transmission: "Manual", year: 2020, price: 8995, mileage: 43000, image: "/carousels/vehicles-9.png" },
  { id: "hb78", make: "Volvo", model: "V40", bodyType: "Hatchback", fuel: "Diesel", transmission: "Manual", year: 2019, price: 12995, mileage: 48000, image: "/carousels/vehicles-2.png" },
  { id: "hb79", make: "Volvo", model: "XC40", bodyType: "Hatchback", fuel: "Petrol", transmission: "Automatic", year: 2022, price: 29995, mileage: 15000, image: "/carousels/vehicles-7.png" },
];

const MAKES = Array.from(new Set(CATALOG.map((c) => c.make))).sort();
const BODY_TYPES = Array.from(new Set(CATALOG.map((c) => c.bodyType))).sort();

// --- Progressive Search State ----------------------------------------------

type ProgressiveState = {
  step: 1 | 2 | 3 | 4;
  make?: string;
  model?: string;
  bodyType?: string;
  year?: number;
};

// Airbnb-style progressive search bar component with Framer Motion
function ProgressiveSearchBar({
  ps,
  setPs,
  fuel,
  setFuel,
  transmission,
  setTransmission,
  maxPrice,
  setMaxPrice,
}: {
  ps: ProgressiveState;
  setPs: Dispatch<SetStateAction<ProgressiveState>>;
  fuel: string;
  setFuel: (v: string) => void;
  transmission: string;
  setTransmission: (v: string) => void;
  maxPrice: number | undefined;
  setMaxPrice: (v: number | undefined) => void;
}) {
  const [openStep, setOpenStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [makeQuery, setMakeQuery] = useState("");

  const modelsForMake = useMemo(() => {
    if (!ps.make) return [] as string[];
    return Array.from(
      new Set(CATALOG.filter((c) => c.make === ps.make).map((c) => c.model))
    ).sort();
  }, [ps.make]);

  const bodyTypesForSelection = useMemo(() => {
    let pool = CATALOG;
    if (ps.make) pool = pool.filter((c) => c.make === ps.make);
    if (ps.model) pool = pool.filter((c) => c.model === ps.model);
    return Array.from(new Set(pool.map((c) => c.bodyType))).sort();
  }, [ps.make, ps.model]);

  const yearsForSelection = useMemo(() => {
    let pool = CATALOG;
    if (ps.make) pool = pool.filter((c) => c.make === ps.make);
    if (ps.model) pool = pool.filter((c) => c.model === ps.model);
    if (ps.bodyType) pool = pool.filter((c) => c.bodyType === ps.bodyType);
    return Array.from(new Set(pool.map((c) => c.year))).sort((a, b) => b - a);
  }, [ps.make, ps.model, ps.bodyType]);

  const pickMake = (m: string) => {
    setPs({ step: 2, make: m });
    setOpenStep(2);
  };
  const pickModel = (m: string) => {
    setPs((s) => ({ step: 3, make: s.make, model: m }));
    setOpenStep(3);
  };
  const pickBody = (b: string) => {
    setPs((s) => ({ step: 4, make: s.make, model: s.model, bodyType: b }));
    setOpenStep(4);
  };
  const pickYear = (y: number) => setPs((s) => ({ ...s, step: 4, year: y }));

  const clearAll = () => {
    setPs({ step: 1 });
    setFuel("Any");
    setTransmission("Any");
    setMaxPrice(undefined);
    setOpenStep(0);
    setMakeQuery("");
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 max-w-5xl mx-auto text-left">
      {/* Search pill */}
      <motion.div
        className="relative bg-white border border-gray-200 rounded-full px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-4 shadow-sm"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          className="flex-1 text-left"
          onClick={() => setOpenStep(openStep === 1 ? 0 : 1)}
        >
          <div className="text-[10px] uppercase text-gray-500">Make</div>
          <div
            className={`text-sm font-medium truncate ${
              ps.make ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {ps.make ?? "Select make"}
          </div>
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <button
          className={`flex-1 text-left ${
            ps.make ? "" : "opacity-60 hover:cursor-not-allowed"
          }`}
          onClick={() => {
            if (!ps.make) {
              setOpenStep(1);
              return;
            }
            setOpenStep(openStep === 2 ? 0 : 2);
          }}
        >
          <div className="text-[10px] uppercase text-gray-500">Model</div>
          <div
            className={`text-sm font-medium truncate ${
              ps.model ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {ps.model ?? "Select model"}
          </div>
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <button
          className="flex-1 text-left"
          onClick={() => {
            if (!ps.make) {
              setOpenStep(1);
              return;
            }
            if (!ps.model) {
              setOpenStep(2);
              return;
            }
            setOpenStep(openStep === 3 ? 0 : 3);
          }}
        >
          <div className="text-[10px] uppercase text-gray-500">Body</div>
          <div
            className={`text-sm font-medium truncate ${
              ps.bodyType ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {ps.bodyType ?? "Select body type"}
          </div>
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <button
          className="flex-1 text-left"
          onClick={() => {
            if (!ps.make) {
              setOpenStep(1);
              return;
            }
            if (!ps.model) {
              setOpenStep(2);
              return;
            }
            if (!ps.bodyType) {
              setOpenStep(3);
              return;
            }
            setOpenStep(openStep === 4 ? 0 : 4);
          }}
        >
          <div className="text-[10px] uppercase text-gray-500">Year</div>
          <div
            className={`text-sm font-medium truncate ${
              ps.year ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {ps.year ?? "Any year"}
          </div>
        </button>

        <Button className="ml-auto bg-primary text-black rounded-full hidden sm:inline-flex">
          <Search className="w-4 h-4 mr-1.5" /> Search
        </Button>
      </motion.div>

      {/* Flyout */}
      <AnimatePresence>
        {openStep !== 0 && (
          <motion.div
            key="flyout"
            variants={flyoutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-3 bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900">
                {openStep === 1 && "Choose a make"}
                {openStep === 2 && "Choose a model"}
                {openStep === 3 && "Choose a body type"}
                {openStep === 4 && "Choose a year"}
              </div>
              <div className="flex items-center gap-3">
                {openStep > 1 && (
                  <button
                    className="text-xs text-gray-600 hover:underline"
                    onClick={() =>
                      setOpenStep((openStep - 1) as 1 | 2 | 3 | 4)
                    }
                  >
                    Back
                  </button>
                )}
                <button
                  className="text-xs text-gray-600 hover:underline"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            </div>
            {openStep === 1 && (
              <>
                <div className="mb-3">
                  <input
                    value={makeQuery}
                    onChange={(e) => setMakeQuery(e.target.value)}
                    placeholder="Search makes"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <motion.div
                  variants={listStagger}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1"
                >
                  {MAKES.filter((m) =>
                    m.toLowerCase().includes(makeQuery.trim().toLowerCase())
                  ).map((m) => (
                    <motion.button
                      key={m}
                      variants={itemFade}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pickMake(m)}
                      className={`px-3 py-2 rounded-full border text-sm ${
                        ps.make === m
                          ? "bg-primary text-black border-primary font-semibold"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
                      }`}
                    >
                      {m}
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}

            {openStep === 2 && (
              <motion.div
                variants={listStagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
              >
                {modelsForMake.length === 0 ? (
                  <div className="text-sm text-gray-500 col-span-full">
                    Select a make first
                  </div>
                ) : (
                  modelsForMake.map((m) => (
                    <motion.button
                      key={m}
                      variants={itemFade}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pickModel(m)}
                      className={`px-3 py-2 rounded-full border text-sm ${
                        ps.model === m
                          ? "bg-primary text-black border-primary font-semibold"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
                      }`}
                    >
                      {m}
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}

            {openStep === 3 && (
              <motion.div
                variants={listStagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
              >
                {bodyTypesForSelection.map((b) => (
                  <motion.button
                    key={b}
                    variants={itemFade}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => pickBody(b)}
                    className={`px-3 py-2 rounded-full border text-sm ${
                      ps.bodyType === b
                        ? "bg-primary text-black border-primary font-semibold"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    {b}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {openStep === 4 && (
              <motion.div
                variants={listStagger}
                initial="initial"
                animate="animate"
                className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1"
              >
                {yearsForSelection.map((y) => (
                  <motion.button
                    key={y}
                    variants={itemFade}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => pickYear(y)}
                    className={`px-3 py-2 rounded-full border text-sm ${
                      ps.year === y
                        ? "bg-primary text-black border-primary font-semibold"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    {y}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Inline refiners */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                >
                  {(["Any", "Petrol", "Diesel", "Hybrid", "Electric"] as const).map(
                    (f) => (
                      <option key={f} value={f}>
                        Fuel: {f}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  {(["Any", "Manual", "Automatic"] as const).map((t) => (
                    <option key={t} value={t}>
                      Transmission: {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  placeholder="Max price (£)"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  value={typeof maxPrice === "number" ? String(maxPrice) : ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  min={0}
                />
              </div>
            </div>

            {/* Breadcrumb + actions */}
            <div className="mt-4 text-sm text-gray-700 flex flex-wrap items-center gap-2">
              <span className="text-gray-500">Selection:</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                {ps.make ?? "Any make"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                {ps.model ?? "Any model"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                {ps.bodyType ?? "Any body"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                {ps.year ?? "Any year"}
              </span>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 text-gray-700"
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <Button
                  className="bg-primary text-black rounded-full"
                  onClick={() => setOpenStep(0)}
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AutoPage() {
  const [ps, setPs] = useState<ProgressiveState>({ step: 1 });
  const [fuel, setFuel] = useState<string>("Any");
  const [transmission, setTransmission] = useState<string>("Any");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % autoHeroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let res = CATALOG.slice();
    if (ps.make) res = res.filter((c) => c.make === ps.make);
    if (ps.model) res = res.filter((c) => c.model === ps.model);
    if (ps.bodyType) res = res.filter((c) => c.bodyType === ps.bodyType);
    if (ps.year) res = res.filter((c) => c.year === ps.year);
    if (fuel !== "Any") res = res.filter((c) => c.fuel === fuel);
    if (transmission !== "Any") res = res.filter((c) => c.transmission === transmission);
    if (typeof maxPrice === "number") res = res.filter((c) => c.price <= maxPrice);
    return res;
  }, [ps, fuel, transmission, maxPrice]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image src="/Logo.png" alt="HAA" width={110} height={110} />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/auto"
                className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
              >
                Auto
              </Link>
              <Link
                href="/organized"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Organized
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
              <a
                href="https://shop-home-and-auto-assistant.myshopify.com/password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Shop
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:bg-[#f1f5f9] hover:text-[#186bbf]"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary-600 text-black rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                  Join Us for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-600">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {autoHeroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-20" : "opacity-0"
              }`}
            >
              <Image src={image} alt={`Auto hero ${index + 1}`} fill className="object-cover" priority={index === 0} />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
              Find your next car
            </h1>
            <p className="text-lg sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Browse by make, model, body type and more—then refine like a pro.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search section below hero */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressiveSearchBar
            ps={ps}
            setPs={setPs}
            fuel={fuel}
            setFuel={setFuel}
            transmission={transmission}
            setTransmission={setTransmission}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filtered.length} cars found
            </h2>
            <div className="text-sm text-gray-500">
              Inspired by CarGurus layout —{" "}
              <a
                className="underline"
                href="https://www.cargurus.co.uk/"
                target="_blank"
                rel="noreferrer"
              >
                cargurus.co.uk
              </a>
            </div>
          </div>

          <motion.div
            variants={gridStagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((car) => (
              <motion.div key={car.id} variants={cardIn} whileHover={{ y: -2 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 rounded-2xl bg-white">
                  <div className="relative h-44 w-full">
                    <Image
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <div className="text-gray-900 font-bold">
                        £{car.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {car.year} • {car.bodyType}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                        {car.fuel}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                        {car.transmission}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                        {car.mileage.toLocaleString()} mi
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Button className="bg-primary hover:bg-primary-600 text-black rounded-full px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                        View details
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm"
                      >
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform features summary */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Vehicle Management Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your vehicles efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: "Vehicle Profiles",
                description:
                  "Store all your vehicle information including make, model, year, and mileage.",
                color: "bg-primary",
              },
              {
                icon: Wrench,
                title: "Maintenance Tracking",
                description:
                  "Track all maintenance services, repairs, and scheduled appointments.",
                color: "bg-primary-600",
              },
              {
                icon: Calendar,
                title: "Service Reminders",
                description:
                  "Never miss a service appointment with smart reminders based on mileage or dates.",
                color: "bg-primary-400",
              },
              {
                icon: FileText,
                title: "Warranty Tracking",
                description: "Keep track of all warranties and their expiration dates.",
                color: "bg-secondary",
              },
              {
                icon: DollarSign,
                title: "Cost Tracking",
                description: "Monitor all vehicle-related expenses and maintenance costs.",
                color: "bg-primary-300",
              },
              {
                icon: Settings,
                title: "Service History",
                description:
                  "Maintain a complete history of all services and repairs for each vehicle.",
                color: "bg-gray-700",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-white border border-gray-200 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Manage Your Vehicles?
          </h2>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Start tracking your vehicles today and never miss important maintenance again.
          </p>
          <Link href="/login">
            <Button className="bg-black hover:bg-gray-900 text-primary rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
