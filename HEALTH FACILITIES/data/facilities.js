const healthFacilitiesData = {
  "type": "FeatureCollection",
  "name": "mayorga_health_facilities",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "name": "Mayorga Rural Health Unit",
        "category": "Hospital",
        "desc": "Main public healthcare facility offering primary checkups, dynamic immunization programs, and maternity birthing facilities.",
        "contact": "DOH-Leyte Field Division",
        "image_url": "images/rhu_main.jpg.jpg"
      },
      "geometry": { "type": "Point", "coordinates": [125.0042, 10.9025] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 2,
        "name": "Poblacion Barangay Health Station",
        "category": "Clinic",
        "desc": "Localized community station providing initial first-aid triage, vital monitoring, and decentralized maternal care services.",
        "contact": "Poblacion Zone 2 Health Desk",
        "image_url": "images/poblacion_bhs.jpg"
      },
      "geometry": { "type": "Point", "coordinates": [125.0017, 10.9056] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 3,
        "name": "Liberty Barangay Health Center",
        "category": "Clinic",
        "desc": "Rural health outpost monitoring community safety metrics and general public health allocations for southern Mayorga.",
        "contact": "Brgy. Liberty Health Desk",
        "image_url": "images/liberty_bhc.png"
      },
      "geometry": { "type": "Point", "coordinates": [124.9994, 10.8775] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mayorga Community Pharmacy Outpost",
        "category": "Pharmacy",
        "desc": "Commercial generic retail center serving prescription refills and general over-the-counter medical supply lines near the highway.",
        "contact": "Poblacion Public Market Zone",
        "image_url": "images/pharmacy_outpost.jpg"
      },
      "geometry": { "type": "Point", "coordinates": [125.0051, 10.9032] }
    }
  ]
};