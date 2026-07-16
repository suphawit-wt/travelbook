-- +goose Up
-- +goose StatementBegin
INSERT INTO currencies(code, rate_to_usd) VALUES ('USD', 1);
INSERT INTO currencies(code, rate_to_usd) VALUES ('THB', 33);

INSERT INTO countries(id, code, name_en, name_local) VALUES ('7bfb0856-9a1a-4a4d-9dab-a2f5cf110eb4', 'TH', 'Thailand', 'ประเทศไทย');
INSERT INTO countries(id, code, name_en, name_local) VALUES ('1bf29311-5fdc-4d5c-b791-9723c7359551', 'JP', 'Japan', 'ญี่ปุ่น');
INSERT INTO countries(id, code, name_en, name_local) VALUES ('c5b106a3-dcaf-4b47-9e2b-3b33aac2eb3f', 'KR', 'Korea', 'เกาหลีใต้');
INSERT INTO countries(id, code, name_en, name_local) VALUES ('15bb287e-39f0-4d31-97fe-000ccd2ae062', 'US', 'United States of America', 'สหรัฐอเมริกา');
INSERT INTO countries(id, code, name_en, name_local) VALUES ('5459241f-0a8f-4fd2-b5ac-4d2f871f7258', 'UK', 'United Kingdom', 'สหราชอาณาจักร');

INSERT INTO provinces(id, country_id, key, name_en, name_local) VALUES ('54d03ca8-baa5-45f0-a35d-88d029c49bcd', '7bfb0856-9a1a-4a4d-9dab-a2f5cf110eb4', 'bangkok', 'Bangkok', 'กรุงเทพ กรุงเทพมหานคร');
INSERT INTO provinces(id, country_id, key, name_en, name_local) VALUES ('b17e415e-38d4-49d0-bddc-b0eb9554bd79', '7bfb0856-9a1a-4a4d-9dab-a2f5cf110eb4', 'chiangMai', 'Chiang Mai', 'เชียงใหม่');
INSERT INTO provinces(id, country_id, key, name_en, name_local) VALUES ('ab3c1fb7-b3f3-4119-943a-f7b64ef7ecd0', '7bfb0856-9a1a-4a4d-9dab-a2f5cf110eb4', 'chonburi', 'Chonburi', 'ชลบุรี');
INSERT INTO provinces(id, country_id, key, name_en, name_local) VALUES ('f1de09c0-c1f1-462a-a9cc-aff8e12788b8', '1bf29311-5fdc-4d5c-b791-9723c7359551', 'tokyo', 'Tokyo', 'โตเกียว');
INSERT INTO provinces(id, country_id, key, name_en, name_local) VALUES ('f2a61edf-3ea7-4a5d-bbda-41cff061947b', '1bf29311-5fdc-4d5c-b791-9723c7359551', 'osaka', 'Osaka', 'โอชาก้า');

INSERT INTO cities(id, province_id, key, name_en, name_local) VALUES ('b3b3a775-c0ff-46a8-93fa-911fdfc454fa', 'b17e415e-38d4-49d0-bddc-b0eb9554bd79', 'muangChiangMai', 'Muang Chiang Mai', 'เมืองเชียงใหม่');
INSERT INTO cities(id, province_id, key, name_en, name_local) VALUES ('b0fc8b0d-1eaa-495b-adf7-1ca0092cdfee', '54d03ca8-baa5-45f0-a35d-88d029c49bcd', 'bangkok', 'Bangkok', 'กรุงเทพ กรุงเทพมหานคร');
INSERT INTO cities(id, province_id, key, name_en, name_local) VALUES ('180448ef-7ca4-4297-b577-68205efc9ed4', 'ab3c1fb7-b3f3-4119-943a-f7b64ef7ecd0', 'pattaya', 'Pattaya', 'พัทยา');
INSERT INTO cities(id, province_id, key, name_en, name_local) VALUES ('5ef4cd3c-c64b-4d86-b119-faf8002e7701', 'f1de09c0-c1f1-462a-a9cc-aff8e12788b8', 'tokyo', 'Tokyo', 'โตเกียว');
INSERT INTO cities(id, province_id, key, name_en, name_local) VALUES ('b66d2101-9153-4771-8f5b-431b73588059', 'f2a61edf-3ea7-4a5d-bbda-41cff061947b', 'osaka', 'Osaka', 'โอชาก้า');

INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('e9ac5ce2-3063-424c-be61-d402f30e7ef2', '180448ef-7ca4-4297-b577-68205efc9ed4', 'kohLarn', 'Koh Larn', 'เกาะล้าน');
INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('d51f0155-1d5a-45d5-bc13-3f25b1c4d17d', 'b0fc8b0d-1eaa-495b-adf7-1ca0092cdfee', 'wattana', 'Wattana', 'วัฒนา');
INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('8256fe43-3ef6-45af-b603-8bf42b240f76', 'b3b3a775-c0ff-46a8-93fa-911fdfc454fa', 'kotchasarn', 'Kotchasarn', 'คชสาร');
INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('9d861139-9c9b-494e-b73c-696fecd0fb41', 'b3b3a775-c0ff-46a8-93fa-911fdfc454fa', 'watKet', 'Wat Ket', 'วัดเกตุ');
INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('8d2825d9-d8ea-46c9-a0ae-646844614529', '5ef4cd3c-c64b-4d86-b119-faf8002e7701', 'ginza', 'Ginza', 'กินซ่า');
INSERT INTO areas(id, city_id, key, name_en, name_local) VALUES ('c586734f-29f6-4923-9db1-4d9b49dfd37a', 'b66d2101-9153-4771-8f5b-431b73588059', 'konohana', 'Konohana', 'โคโนะฮานะ');

INSERT INTO public.properties (
    id, name, slug, type, status, timezone, 
    check_in_from, check_in_until, check_out_from, check_out_until, 
    area_id, address_line1, address_line2, zip_code, latitude, longitude, 
    avg_rating, review_count, staff_avg, cleanliness_avg, facilities_avg, 
    comfort_avg, value_avg, location_avg, wifi_avg, about, highlights, 
    area_info, rules, fine_print, partner_id, created_at, updated_at, deleted_at
) VALUES 
(
    '49a9eccd-0746-4647-bce2-13a20b482f1d', 'Malaya Villa Kohlarn', 'malaya-villa-kohlarn-c5ohnm', 'villa', 'active', 'Asia/Bangkok',
    '14:00:00', '21:00:00', '11:00:00', '11:30:00',
    'e9ac5ce2-3063-424c-be61-d402f30e7ef2', '181/23 ม.7', NULL, '20150', 12.9182259, 100.7802624,
    0.00, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Malaya Villa Kohlarn in Koh Larn offers rooms with air-conditioning, private bathrooms, and balconies. Each room includes a terrace, garden views, and a private bathroom with free toiletries.',
    '{"RoomsWith": ["bread", "coffee"], "BreakfastInfo": null}',
    '{"Beaches": [], "NearbyPlaces": [{"Name": "Artory Cafe", "Type": "cafeBar", "DistanceM": 850}], "NaturalBeauty": [], "PublicTransit": [], "TopAttractions": [], "ClosestAirports": [], "RestaurantsCafe": []}',
    '{"CheckIn": {"From": "", "Until": ""}, "CheckOut": {"From": "", "Until": ""}, "PetsAllowed": false, "ChildPolicies": {"Allowed": false, "MinAgeAllowed": null, "ChargedAsAdultsAge": null}, "DamageDeposit": {"Price": null, "Required": false}, "MinCheckInAge": 18, "PartiesAllowed": false, "AcceptedPayment": ["cash", "visa", "mastercard", "promtpay"], "CribAndExtraBedPolicies": {"Crib": {"Free": false, "Price": null, "AgeRange": {"Max": 5, "Min": 1}}, "ExtraBed": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 18}}}}',
    'Check-in after 2pm', '3b512901-2158-4b5f-bad4-1d348173716c', '2026-05-25 17:48:15.632896+00', '2026-05-25 19:32:50.896929+00', NULL
),
(
    '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'The Park Front Hotel at Universal Studios Japan', 'the-park-front-hotel-at-universal-studios-japan-d5qsqp', 'hotel', 'active', 'Asia/Tokyo',
    '15:00:00', '00:00:00', '11:00:00', '11:30:00',
    'c586734f-29f6-4923-9db1-4d9b49dfd37a', 'Konohana-ku Shimaya 6-2-52', NULL, '554-0024', 12.9182259, 100.7802624,
    0.00, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Universal City Station is a 12-minute ride from JR Osaka Station via train, and a 20-minute ride from JR Shin-Osaka Station, where bullet train access is provided. The limousine bus service from Osaka International Airport to the property takes 45-minutes. From Kansai International Airport, the limousine bus will take 70-minutes. By car, it is around a 20-minute drive from Osaka via the Hanshin Express Way.',
    '{"RoomsWith": ["bread", "coffee"], "BreakfastInfo": null}',
    '{"Beaches": [], "NearbyPlaces": [{"Name": "Artory Cafe", "Type": "cafeBar", "DistanceM": 850}], "NaturalBeauty": [], "PublicTransit": [], "TopAttractions": [], "ClosestAirports": [], "RestaurantsCafe": []}',
    '{"CheckIn": {"From": "", "Until": ""}, "CheckOut": {"From": "", "Until": ""}, "PetsAllowed": false, "ChildPolicies": {"Allowed": true, "MinAgeAllowed": 0, "ChargedAsAdultsAge": 6}, "DamageDeposit": {"Price": null, "Required": false}, "MinCheckInAge": 18, "PartiesAllowed": false, "AcceptedPayment": ["cash", "visa", "mastercard"], "CribAndExtraBedPolicies": {"Crib": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}, "ExtraBed": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}}}',
    'When booking for 15 people or more, different policies and additional supplements may apply. Please contact the property directly for more details. The property may directly call the guest after booking, and if the guest cannot be contacted or there is no available phone number, the reservation will be canceled.', '3b512901-2158-4b5f-bad4-1d348173716c', '2026-05-26 14:45:14.721662+00', '2026-05-26 17:54:03.660277+00', NULL
),
(
    '9d176656-8eda-4f66-87ef-57b2089e95ad', 'KOKO HOTEL Ginza-1chome', 'koko-hotel-ginza-1chome-fh7ju2', 'hotel', 'active', 'Asia/Tokyo',
    '15:00:00', '00:00:00', '11:00:00', '11:30:00',
    '8d2825d9-d8ea-46c9-a0ae-646844614529', 'Chuo-ku Ginza1-9-5', NULL, '104-0061', 12.9182259, 100.7802624,
    0.00, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Comfortable Accommodations: KOKO HOTEL Ginza-1chome in Tokyo offers comfortable rooms with air-conditioning, private bathrooms, and modern amenities. Each room includes a tea and coffee maker, bidet, hairdryer, and free toiletries.',
    '{"RoomsWith": ["bread", "coffee"], "BreakfastInfo": null}',
    '{"Beaches": [], "NearbyPlaces": [{"Name": "Artory Cafe", "Type": "cafeBar", "DistanceM": 850}], "NaturalBeauty": [], "PublicTransit": [], "TopAttractions": [], "ClosestAirports": [], "RestaurantsCafe": []}',
    '{"CheckIn": {"From": "", "Until": ""}, "CheckOut": {"From": "", "Until": ""}, "PetsAllowed": false, "ChildPolicies": {"Allowed": true, "MinAgeAllowed": 0, "ChargedAsAdultsAge": 7}, "DamageDeposit": {"Price": null, "Required": false}, "MinCheckInAge": 18, "PartiesAllowed": false, "AcceptedPayment": ["cash", "visa", "mastercard"], "CribAndExtraBedPolicies": {"Crib": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}, "ExtraBed": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}}}',
    'Please inform KOKO HOTEL Ginza-1chome of your expected arrival time in advance. You can use the Special Requests box when booking, or contact the property directly using the contact details in your confirmation.', '3b512901-2158-4b5f-bad4-1d348173716c', '2026-05-26 17:59:47.783434+00', '2026-05-26 18:15:51.039373+00', NULL
),
(
    'f0102826-790b-4c26-9dda-eb5316f41364', 'Rimping Village', 'rimping-village-8dxy28', 'hotel', 'active', 'Asia/Bangkok',
    '14:00:00', '00:00:00', '11:00:00', '12:30:00',
    '9d861139-9c9b-494e-b73c-696fecd0fb41', 'Wat Ket 13/1 soi 2', NULL, '50000', 12.9182259, 100.7802624,
    0.00, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'A 10-minute walk from Chiang Mai Night Bazaar and Wat Gate Temple, Rimping Village has comfortable accommodations with free Wi-Fi and free parking. It has an outdoor swimming pool, a terrace, and a tour desk.',
    '{"RoomsWith": ["bread", "coffee"], "BreakfastInfo": null}',
    '{"Beaches": [], "NearbyPlaces": [{"Name": "Artory Cafe", "Type": "cafeBar", "DistanceM": 850}], "NaturalBeauty": [], "PublicTransit": [], "TopAttractions": [], "ClosestAirports": [], "RestaurantsCafe": []}',
    '{"CheckIn": {"From": "", "Until": ""}, "CheckOut": {"From": "", "Until": ""}, "PetsAllowed": false, "ChildPolicies": {"Allowed": true, "MinAgeAllowed": 12, "ChargedAsAdultsAge": 6}, "DamageDeposit": {"Price": null, "Required": false}, "MinCheckInAge": 1, "PartiesAllowed": false, "AcceptedPayment": ["cash", "visa", "mastercard", "promptpay"], "CribAndExtraBedPolicies": {"Crib": {"Free": true, "Price": null, "AgeRange": {"Max": 2, "Min": 1}}, "ExtraBed": {"Free": false, "Price": {"Amount": 1000, "Currency": "THB"}, "AgeRange": {"Max": null, "Min": 1}}}}',
    'Please inform KOKO HOTEL Ginza-1chome of your expected arrival time in advance. You can use the Special Requests box when booking, or contact the property directly using the contact details in your confirmation.', '3b512901-2158-4b5f-bad4-1d348173716c', '2026-05-28 15:57:59.209838+00', '2026-05-28 16:18:05.865802+00', NULL
),
(
    'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'POR Kotchasarn', 'por-kotchasarn-tllhcb', 'hotel', 'active', 'Asia/Bangkok',
    '14:00:00', '23:00:00', '12:00:00', '00:00:00',
    '8256fe43-3ef6-45af-b603-8bf42b240f76', 'Kotchasarn', 'Kotchasarn Lane 1st, Alley 1', '50100', 12.9182259, 100.7802624,
    0.00, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Comfortable Accommodations: POR Kotchasarn in Chiang Mai offers family rooms with air-conditioning, private bathrooms, and balconies. Each room includes a work desk, mini-bar, and free WiFi.',
    '{"RoomsWith": ["bread", "coffee"], "BreakfastInfo": null}',
    '{"Beaches": [], "NearbyPlaces": [{"Name": "Artory Cafe", "Type": "cafeBar", "DistanceM": 850}], "NaturalBeauty": [], "PublicTransit": [], "TopAttractions": [], "ClosestAirports": [], "RestaurantsCafe": []}',
    '{"CheckIn": {"From": "", "Until": ""}, "CheckOut": {"From": "", "Until": ""}, "PetsAllowed": false, "ChildPolicies": {"Allowed": true, "MinAgeAllowed": 12, "ChargedAsAdultsAge": null}, "DamageDeposit": {"Price": null, "Required": false}, "MinCheckInAge": 18, "PartiesAllowed": false, "AcceptedPayment": ["cash", "visa", "mastercard", "promptpay"], "CribAndExtraBedPolicies": {"Crib": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}, "ExtraBed": {"Free": false, "Price": null, "AgeRange": {"Max": null, "Min": 1}}}}',
    'Please inform KOKO HOTEL Ginza-1chome of your expected arrival time in advance. You can use the Special Requests box when booking, or contact the property directly using the contact details in your confirmation.', '3b512901-2158-4b5f-bad4-1d348173716c', '2026-05-28 07:37:40.923035+00', '2026-05-28 12:05:00.641306+00', NULL
);


-- Insert Property Images
INSERT INTO public.property_images (
    id, property_id, key, image_url, position, orientation, created_at
) VALUES 
('5e43711d-cb05-4283-9464-c6ca11c8c721', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/5e43711d-cb05-4283-9464-c6ca11c8c721.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/5e43711d-cb05-4283-9464-c6ca11c8c721.jpg', 1, 'landscape', '2026-05-25 19:32:23.514543+00'),
('4f683dac-0b19-4cce-aaa7-2c1678bdfb7c', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/4f683dac-0b19-4cce-aaa7-2c1678bdfb7c.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/4f683dac-0b19-4cce-aaa7-2c1678bdfb7c.jpg', 2, 'landscape', '2026-05-25 19:32:23.514543+00'),
('15f5ff18-7a38-4f23-9a9b-ebdf22c5ebf0', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/15f5ff18-7a38-4f23-9a9b-ebdf22c5ebf0.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/15f5ff18-7a38-4f23-9a9b-ebdf22c5ebf0.jpg', 3, 'landscape', '2026-05-25 19:32:23.514543+00'),
('6a9d564c-5351-4020-b192-2d2d93048f63', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/6a9d564c-5351-4020-b192-2d2d93048f63.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/6a9d564c-5351-4020-b192-2d2d93048f63.jpg', 4, 'landscape', '2026-05-25 19:32:23.514543+00'),
('1c733e41-860b-4f01-a2ba-aaeba2c60892', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/1c733e41-860b-4f01-a2ba-aaeba2c60892.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/49a9eccd-0746-4647-bce2-13a20b482f1d/images/1c733e41-860b-4f01-a2ba-aaeba2c60892.jpg', 5, 'landscape', '2026-05-25 19:32:23.514543+00'),
('d8b9b307-5091-4356-a15e-4e9bed445e63', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/d8b9b307-5091-4356-a15e-4e9bed445e63.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/d8b9b307-5091-4356-a15e-4e9bed445e63.jpg', 1, 'landscape', '2026-05-26 17:53:52.185532+00'),
('44142a24-6d44-4102-b801-ab63d8e8f840', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/44142a24-6d44-4102-b801-ab63d8e8f840.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/44142a24-6d44-4102-b801-ab63d8e8f840.jpg', 2, 'landscape', '2026-05-26 17:53:52.185532+00'),
('b4629189-1ac8-42a6-aa9e-ea9751ff4890', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/b4629189-1ac8-42a6-aa9e-ea9751ff4890.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/b4629189-1ac8-42a6-aa9e-ea9751ff4890.jpg', 3, 'landscape', '2026-05-26 17:53:52.185532+00'),
('cf1dd688-322d-47cc-99a2-86d3dac85491', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/cf1dd688-322d-47cc-99a2-86d3dac85491.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/cf1dd688-322d-47cc-99a2-86d3dac85491.jpg', 4, 'landscape', '2026-05-26 17:53:52.185532+00'),
('e1336ff2-f7d3-40b1-bc49-66dd33eac7f9', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/e1336ff2-f7d3-40b1-bc49-66dd33eac7f9.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/38d4d122-f84b-4668-b6ac-5ce52313eda9/images/e1336ff2-f7d3-40b1-bc49-66dd33eac7f9.jpg', 5, 'landscape', '2026-05-26 17:53:52.185532+00'),
('e0fe1031-f74a-463e-b050-d7990000cf4e', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/e0fe1031-f74a-463e-b050-d7990000cf4e.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/e0fe1031-f74a-463e-b050-d7990000cf4e.jpg', 1, 'landscape', '2026-05-26 18:13:49.059+00'),
('48771a8d-8673-471b-833d-431d717288e6', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/48771a8d-8673-471b-833d-431d717288e6.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/48771a8d-8673-471b-833d-431d717288e6.jpg', 2, 'landscape', '2026-05-26 18:13:49.059+00'),
('1106adef-941d-45f0-858b-823863cbbdcd', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/1106adef-941d-45f0-858b-823863cbbdcd.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/1106adef-941d-45f0-858b-823863cbbdcd.jpg', 3, 'landscape', '2026-05-26 18:13:49.059+00'),
('2a0d5272-7781-40b0-b143-eb17a4d901b0', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/2a0d5272-7781-40b0-b143-eb17a4d901b0.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/2a0d5272-7781-40b0-b143-eb17a4d901b0.jpg', 4, 'landscape', '2026-05-26 18:13:49.059+00'),
('85147305-3708-429a-9eb3-b0fd2af0d536', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/85147305-3708-429a-9eb3-b0fd2af0d536.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/9d176656-8eda-4f66-87ef-57b2089e95ad/images/85147305-3708-429a-9eb3-b0fd2af0d536.jpg', 5, 'landscape', '2026-05-26 18:13:49.059+00'),
('e89f0978-918c-474c-98c0-930c5fff7a0e', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/e89f0978-918c-474c-98c0-930c5fff7a0e.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/e89f0978-918c-474c-98c0-930c5fff7a0e.jpg', 1, 'landscape', '2026-05-28 11:50:38.895591+00'),
('c57a344e-ccdb-4ab6-8a8a-16f8ce79494d', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c57a344e-ccdb-4ab6-8a8a-16f8ce79494d.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c57a344e-ccdb-4ab6-8a8a-16f8ce79494d.jpg', 2, 'landscape', '2026-05-28 11:50:38.895591+00'),
('c10eed10-7dde-4ef1-8a46-0934d6eb1fed', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c10eed10-7dde-4ef1-8a46-0934d6eb1fed.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c10eed10-7dde-4ef1-8a46-0934d6eb1fed.jpg', 3, 'landscape', '2026-05-28 11:50:38.895591+00'),
('fcd5d957-d7bd-428d-a3a6-5b7f1b00567c', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/fcd5d957-d7bd-428d-a3a6-5b7f1b00567c.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/fcd5d957-d7bd-428d-a3a6-5b7f1b00567c.jpg', 4, 'landscape', '2026-05-28 11:50:38.895591+00'),
('a7ba01fc-e4d2-46ff-b44e-3dc3255e0fab', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/a7ba01fc-e4d2-46ff-b44e-3dc3255e0fab.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/a7ba01fc-e4d2-46ff-b44e-3dc3255e0fab.jpg', 5, 'landscape', '2026-05-28 11:50:38.895591+00'),
('43b4611d-dc4a-4f25-b4bb-65a5c1a0756b', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/43b4611d-dc4a-4f25-b4bb-65a5c1a0756b.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/43b4611d-dc4a-4f25-b4bb-65a5c1a0756b.jpg', 6, 'landscape', '2026-05-28 11:52:42.139931+00'),
('3ebc37d1-87df-4397-9a5b-a7abdfd9858e', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/3ebc37d1-87df-4397-9a5b-a7abdfd9858e.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/3ebc37d1-87df-4397-9a5b-a7abdfd9858e.jpg', 7, 'landscape', '2026-05-28 11:52:42.139931+00'),
('053cf4a6-751d-4ca9-974c-ab3d34427ce2', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/053cf4a6-751d-4ca9-974c-ab3d34427ce2.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/053cf4a6-751d-4ca9-974c-ab3d34427ce2.jpg', 8, 'landscape', '2026-05-28 11:52:42.139931+00'),
('c8c80113-b1da-47ed-a931-a62ee74e7367', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c8c80113-b1da-47ed-a931-a62ee74e7367.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/c8c80113-b1da-47ed-a931-a62ee74e7367.jpg', 9, 'landscape', '2026-05-28 11:52:42.139931+00'),
('e74874a7-b0cd-43b0-9363-bcc86aadb137', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/e74874a7-b0cd-43b0-9363-bcc86aadb137.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/e74874a7-b0cd-43b0-9363-bcc86aadb137.jpg', 10, 'landscape', '2026-05-28 11:52:42.139931+00'),
('cac489c6-f98a-4ed6-8c01-b885f17b7a10', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/cac489c6-f98a-4ed6-8c01-b885f17b7a10.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/cac489c6-f98a-4ed6-8c01-b885f17b7a10.jpg', 11, 'landscape', '2026-05-28 11:57:35.220242+00'),
('ba5b9342-95cb-4e04-aa97-837cee3d5822', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/ba5b9342-95cb-4e04-aa97-837cee3d5822.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/ba5b9342-95cb-4e04-aa97-837cee3d5822.jpg', 12, 'landscape', '2026-05-28 11:57:35.220242+00'),
('6820051a-1644-45cd-b1a8-c335ce259c7f', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/6820051a-1644-45cd-b1a8-c335ce259c7f.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/6820051a-1644-45cd-b1a8-c335ce259c7f.jpg', 13, 'landscape', '2026-05-28 11:57:35.220242+00'),
('05f4d673-4022-4add-a216-a0254c732617', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/05f4d673-4022-4add-a216-a0254c732617.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/05f4d673-4022-4add-a216-a0254c732617.jpg', 14, 'portrait', '2026-05-28 11:57:35.220242+00'),
('6be0d707-e1e4-4daf-a1e9-602446eabe87', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/6be0d707-e1e4-4daf-a1e9-602446eabe87.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/6be0d707-e1e4-4daf-a1e9-602446eabe87.jpg', 15, 'portrait', '2026-05-28 11:57:35.220242+00'),
('1a607994-c79a-4683-9a2c-3828138f6fa0', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/1a607994-c79a-4683-9a2c-3828138f6fa0.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/1a607994-c79a-4683-9a2c-3828138f6fa0.jpg', 16, 'portrait', '2026-05-28 12:01:11.860366+00'),
('97016591-6162-4d21-b6ff-17a85d545035', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/97016591-6162-4d21-b6ff-17a85d545035.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/97016591-6162-4d21-b6ff-17a85d545035.jpg', 17, 'portrait', '2026-05-28 12:01:11.860366+00'),
('2220ac9c-f3d9-40ff-b26b-7d38311b4877', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/2220ac9c-f3d9-40ff-b26b-7d38311b4877.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/2220ac9c-f3d9-40ff-b26b-7d38311b4877.jpg', 18, 'portrait', '2026-05-28 12:01:11.860366+00'),
('a6d0938a-5530-4502-b1d8-50f45d075089', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/a6d0938a-5530-4502-b1d8-50f45d075089.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/a6d0938a-5530-4502-b1d8-50f45d075089.jpg', 19, 'portrait', '2026-05-28 12:01:11.860366+00'),
('714cc557-6c82-4d5c-8dc8-290cccb11f8e', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/714cc557-6c82-4d5c-8dc8-290cccb11f8e.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/714cc557-6c82-4d5c-8dc8-290cccb11f8e.jpg', 20, 'landscape', '2026-05-28 12:01:11.860366+00'),
('decbcb6c-0bee-4f9a-8635-436325e42083', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/decbcb6c-0bee-4f9a-8635-436325e42083.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/decbcb6c-0bee-4f9a-8635-436325e42083.jpg', 21, 'landscape', '2026-05-28 12:03:48.504272+00'),
('ad500ff1-c7ca-486b-8b3f-0d7aa7dd9086', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/ad500ff1-c7ca-486b-8b3f-0d7aa7dd9086.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/ad500ff1-c7ca-486b-8b3f-0d7aa7dd9086.jpg', 22, 'landscape', '2026-05-28 12:03:48.504272+00'),
('607d2644-f921-4af5-b6c2-922654b0581a', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/607d2644-f921-4af5-b6c2-922654b0581a.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/607d2644-f921-4af5-b6c2-922654b0581a.jpg', 23, 'landscape', '2026-05-28 12:03:48.504272+00'),
('56f5e448-0b39-4146-b537-08de7ab43d82', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/56f5e448-0b39-4146-b537-08de7ab43d82.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f9fdde87-8389-4a95-b01c-9a7d94d4126d/images/56f5e448-0b39-4146-b537-08de7ab43d82.jpg', 24, 'landscape', '2026-05-28 12:03:48.504272+00'),
('5240e8f5-4963-4206-9a14-d1bc6ed1b574', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/5240e8f5-4963-4206-9a14-d1bc6ed1b574.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/5240e8f5-4963-4206-9a14-d1bc6ed1b574.jpg', 1, 'landscape', '2026-05-28 16:14:18.700204+00'),
('b55bd992-4902-4d10-9d2f-98444f46294c', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/b55bd992-4902-4d10-9d2f-98444f46294c.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/b55bd992-4902-4d10-9d2f-98444f46294c.jpg', 2, 'landscape', '2026-05-28 16:14:18.700204+00'),
('ae22034b-e183-4fa0-82d1-b9b328913591', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/ae22034b-e183-4fa0-82d1-b9b328913591.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/ae22034b-e183-4fa0-82d1-b9b328913591.jpg', 3, 'landscape', '2026-05-28 16:14:18.700204+00'),
('8ed27d9e-1252-4318-93ab-b1e73b31b6f1', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/8ed27d9e-1252-4318-93ab-b1e73b31b6f1.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/8ed27d9e-1252-4318-93ab-b1e73b31b6f1.jpg', 4, 'portrait', '2026-05-28 16:14:18.700204+00'),
('fbce4311-310f-4ff9-b61f-2cba1fc4e0c7', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/fbce4311-310f-4ff9-b61f-2cba1fc4e0c7.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/fbce4311-310f-4ff9-b61f-2cba1fc4e0c7.jpg', 5, 'portrait', '2026-05-28 16:14:18.700204+00'),
('9a0868fa-d5b3-4d69-9cac-1f5a14862d51', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/9a0868fa-d5b3-4d69-9cac-1f5a14862d51.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/9a0868fa-d5b3-4d69-9cac-1f5a14862d51.jpg', 6, 'landscape', '2026-05-28 16:16:13.946611+00'),
('3c7b693b-ad1c-428a-85da-937d909ac22a', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/3c7b693b-ad1c-428a-85da-937d909ac22a.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/3c7b693b-ad1c-428a-85da-937d909ac22a.jpg', 7, 'landscape', '2026-05-28 16:16:13.946611+00'),
('19b6c3fb-2a8a-4659-ba65-5c0b0f75067f', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/19b6c3fb-2a8a-4659-ba65-5c0b0f75067f.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/19b6c3fb-2a8a-4659-ba65-5c0b0f75067f.jpg', 8, 'landscape', '2026-05-28 16:16:13.946611+00'),
('f741855c-01f5-4655-9fda-7d3cf58b8cf1', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/f741855c-01f5-4655-9fda-7d3cf58b8cf1.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/f741855c-01f5-4655-9fda-7d3cf58b8cf1.jpg', 9, 'landscape', '2026-05-28 16:16:13.946611+00'),
('f14cb9bb-a65b-4883-800b-2c516e7047e8', 'f0102826-790b-4c26-9dda-eb5316f41364', 'properties/f0102826-790b-4c26-9dda-eb5316f41364/images/f14cb9bb-a65b-4883-800b-2c516e7047e8.jpg', 'https://pub-909a2ad2f72d4772ad41520e2ab1a85c.r2.dev/properties/f0102826-790b-4c26-9dda-eb5316f41364/images/f14cb9bb-a65b-4883-800b-2c516e7047e8.jpg', 10, 'portrait', '2026-05-28 16:16:13.946611+00');

INSERT INTO public.room_types (
    id, 
    property_id, 
    name, 
    max_adults, 
    max_children, 
    base_price_usd, 
    total_rooms, 
    created_at, 
    updated_at
) VALUES
('4d859626-8522-4707-952f-a781ff27cf3c', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'King Room with Pool View', 2, 1, 159.00, 3, '2026-05-25 17:53:37.389524+00', '2026-05-25 17:53:37.389524+00'),
('8401b5b6-4fa4-4fdd-8b11-c723d4a7b1a6', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'Superior Floor City View Twin Room', 2, 1, 150.00, 5, '2026-05-26 17:34:04.122521+00', '2026-05-26 17:34:04.122521+00'),
('3fc0cf0a-1988-405c-b8c2-6c3d3b641452', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'Superior Floor Deluxe City View Quadruple Room', 4, 1, 288.00, 5, '2026-05-26 17:39:12.053847+00', '2026-05-26 17:39:12.053847+00'),
('3792ac55-7e54-4c1f-a4a3-61b5a2ae2a38', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'Semi Double Room - Non-Smoking', 2, 1, 134.00, 5, '2026-05-26 18:07:21.231063+00', '2026-05-26 18:07:21.231063+00'),
('11566a45-49be-4829-acdc-5c23031925ae', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'Standard Double Room', 2, 1, 94.00, 10, '2026-05-28 07:47:18.708435+00', '2026-05-28 07:47:18.708435+00'),
('5f2a1546-db56-42dd-b42e-90068343aeb2', 'f0102826-790b-4c26-9dda-eb5316f41364', 'Superior Twin Room', 2, 1, 160.00, 5, '2026-05-28 16:07:38.506618+00', '2026-05-28 16:07:38.506618+00');

INSERT INTO public.room_beds (
    id, 
    room_type_id, 
    bed_type, 
    quantity
) VALUES
('8c76c072-beb9-48d1-b49e-83454cfe334a', '4d859626-8522-4707-952f-a781ff27cf3c', 'king', 1),
('0454c9d3-9b4b-49e5-aa21-38e9b18069c5', '8401b5b6-4fa4-4fdd-8b11-c723d4a7b1a6', 'twin', 2),
('8e61b0de-d93d-4d50-a5e3-3e713954b715', '3fc0cf0a-1988-405c-b8c2-6c3d3b641452', 'twin', 2),
('dd7b5438-8808-4a11-9702-be9265a999dd', '3fc0cf0a-1988-405c-b8c2-6c3d3b641452', 'sofa', 2),
('05efd675-9209-4a5e-a0e7-b5201b0a4343', '3792ac55-7e54-4c1f-a4a3-61b5a2ae2a38', 'king', 1),
('8881b243-6dfa-468b-abeb-a0ef2d189162', '11566a45-49be-4829-acdc-5c23031925ae', 'king', 1),
('1265aee3-62dd-44c4-9467-8ff2b0b1c7eb', '5f2a1546-db56-42dd-b42e-90068343aeb2', 'twin', 2);

INSERT INTO public.rate_plans (
    id, 
    room_type_id, 
    name, 
    refundable, 
    breakfast_included, 
    price_modifier_usd, 
    created_at, 
    updated_at
) VALUES
('27e5e792-fc2f-4a45-96a0-7f9fdaeb7a06', '4d859626-8522-4707-952f-a781ff27cf3c', 'Standard', false, false, 1.00, '2026-05-25 17:56:48.153193+00', '2026-05-25 17:56:48.153193+00'),
('0bf1fa70-5413-4ccf-88f1-b4cf5d045d67', '4d859626-8522-4707-952f-a781ff27cf3c', 'Breakfast Included', false, true, 10.00, '2026-05-25 17:55:53.769755+00', '2026-05-25 17:55:53.769755+00'),
('024a00bc-2b28-46bc-8a22-60538bc3bf2e', '3fc0cf0a-1988-405c-b8c2-6c3d3b641452', 'Breakfast Included', false, true, 77.00, '2026-05-26 17:40:07.332111+00', '2026-05-26 17:40:07.332111+00'),
('57974725-7c5a-4b8c-a3de-302183d0d5f6', '8401b5b6-4fa4-4fdd-8b11-c723d4a7b1a6', 'Breakfast Included', false, true, 39.00, '2026-05-26 17:41:10.288572+00', '2026-05-26 17:41:10.288572+00'),
('60de4461-c0ec-4357-9062-2f6cf9f1a5e9', '8401b5b6-4fa4-4fdd-8b11-c723d4a7b1a6', 'Standard', false, false, 1.00, '2026-05-26 17:41:29.831404+00', '2026-05-26 17:41:29.831404+00'),
('fd6c495e-56cf-4e53-83c0-04f1ca534773', '3fc0cf0a-1988-405c-b8c2-6c3d3b641452', 'Standard', false, false, 1.00, '2026-05-26 17:41:44.888093+00', '2026-05-26 17:41:44.888093+00'),
('46ae9f6b-410a-405b-9378-71dfc69ed60b', '3792ac55-7e54-4c1f-a4a3-61b5a2ae2a38', 'Standard', false, false, 1.00, '2026-05-26 18:07:43.563751+00', '2026-05-26 18:07:43.563751+00'),
('6006bb46-904c-44ff-b88d-a95c16e98351', '3792ac55-7e54-4c1f-a4a3-61b5a2ae2a38', 'Breakfast Included', false, true, 8.00, '2026-05-26 18:08:25.68467+00', '2026-05-26 18:08:25.68467+00'),
('b1a8b555-82eb-45dd-a604-23c2c5bfc606', '11566a45-49be-4829-acdc-5c23031925ae', 'Breakfast Included', false, true, 10.00, '2026-05-28 07:48:27.245408+00', '2026-05-28 07:48:27.245408+00'),
('a788211d-a079-454c-863a-72affae0abd2', '11566a45-49be-4829-acdc-5c23031925ae', 'Standard', false, false, 1.00, '2026-05-28 07:48:59.519521+00', '2026-05-28 07:48:59.519521+00'),
('c0cddeac-3a15-436c-a79e-bbe10818b1d6', '5f2a1546-db56-42dd-b42e-90068343aeb2', 'Breakfast Included', false, true, 1.00, '2026-05-28 16:08:54.406699+00', '2026-05-28 16:08:54.406699+00');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.rate_plans;
DELETE FROM public.room_beds;
DELETE FROM public.room_types;
DELETE FROM public.property_images;
DELETE FROM public.properties;
DELETE FROM public.areas;
DELETE FROM public.cities;
DELETE FROM public.provinces;
DELETE FROM public.countries;
DELETE FROM public.currencies;
-- +goose StatementEnd
