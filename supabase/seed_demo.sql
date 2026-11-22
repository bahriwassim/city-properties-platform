-- Fictional catalogue records for previews and local development only.
-- Every record is explicitly titled DEMO / SAMPLE and demo_data=true.
insert into public.properties
  (slug,title,short_description,description,property_type,listing_type,status,price,price_label,address,city,county,bedrooms,bathrooms,floor_area,property_reference,ber_rating,parking,featured,new_home,demo_data,published)
values
  ('demo-residence-canal-view','DEMO / SAMPLE - Residence at Canal View','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','apartment','sale','available',495000,'EUR 495,000','Canal View','Dublin 2','Dublin',2,2,86,'DEMO-S-001','B2','Underground',true,false,true,true),
  ('demo-house-ranelagh','DEMO / SAMPLE - Ranelagh Gardens','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','house','sale','available',825000,'EUR 825,000','Garden Lane','Ranelagh','Dublin',3,2,142,'DEMO-S-002','C1','On street',true,false,true,true),
  ('demo-apartment-ballsbridge','DEMO / SAMPLE - Ballsbridge Apartment','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','apartment','sale','available',610000,'EUR 610,000','Embassy Court','Ballsbridge','Dublin',2,2,94,'DEMO-S-003','A3','Allocated',false,false,true,true),
  ('demo-duplex-clontarf','DEMO / SAMPLE - Clontarf Duplex','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','duplex','sale','available',570000,'EUR 570,000','Coast Road','Clontarf','Dublin',3,2,118,'DEMO-S-004','B1','Driveway',false,false,true,true),
  ('demo-house-drumcondra','DEMO / SAMPLE - Drumcondra House','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','house','sale','available',545000,'EUR 545,000','Elm Terrace','Drumcondra','Dublin',3,1,104,'DEMO-S-005','C2','On street',false,false,true,true),
  ('demo-apartment-glasnevin','DEMO / SAMPLE - Glasnevin Residence','Fictional sample listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual listing.','apartment','sale','available',385000,'EUR 385,000','Botanic Square','Glasnevin','Dublin',2,1,72,'DEMO-S-006','B3','Allocated',false,false,true,true),
  ('demo-rental-rathmines','DEMO / SAMPLE - Rathmines Apartment','Fictional sample rental. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual rental.','apartment','rent','available',2450,'EUR 2,450 per month','South Circular Road','Rathmines','Dublin',2,1,76,'DEMO-R-001','B2','On street',false,false,true,true),
  ('demo-rental-dublin-8','DEMO / SAMPLE - Dublin 8 Townhouse','Fictional sample rental. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual rental.','house','rent','available',3350,'EUR 3,350 per month','Liberty Lane','Dublin 8','Dublin',3,2,119,'DEMO-R-002','C1','On street',false,false,true,true),
  ('demo-rental-dublin-6','DEMO / SAMPLE - Dublin 6 Apartment','Fictional sample rental. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual rental.','apartment','rent','available',1950,'EUR 1,950 per month','Beechwood Court','Dublin 6','Dublin',1,1,54,'DEMO-R-003','A3','None',false,false,true,true),
  ('demo-rental-citywest','DEMO / SAMPLE - Citywest Home','Fictional sample rental. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual rental.','house','rent','available',2800,'EUR 2,800 per month','Parkside Walk','Citywest','Dublin',3,2,110,'DEMO-R-004','B2','Driveway',false,false,true,true),
  ('demo-commercial-office','DEMO / SAMPLE - City Centre Office','Fictional sample commercial listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual commercial listing.','office','commercial','available',750000,'Price on application','Business Quarter','Dublin 2','Dublin',null,null,245,'DEMO-C-001',null,'None',false,false,true,true),
  ('demo-commercial-retail','DEMO / SAMPLE - Rathmines Retail Unit','Fictional sample commercial listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual commercial listing.','retail','commercial','available',3200,'EUR 3,200 per month','Main Street','Rathmines','Dublin',null,null,96,'DEMO-C-002',null,'Rear access',false,false,true,true),
  ('demo-commercial-industrial','DEMO / SAMPLE - Citywest Industrial Unit','Fictional sample commercial listing. Not a real property.','This fictional property is included only to demonstrate the City Properties website. It is not an actual commercial listing.','industrial','commercial','available',1850000,'EUR 1,850,000','Enterprise Park','Citywest','Dublin',null,null,680,'DEMO-C-003',null,'Loading bay',false,false,true,true)
on conflict (slug) do update set
  title=excluded.title,short_description=excluded.short_description,description=excluded.description,
  property_type=excluded.property_type,listing_type=excluded.listing_type,status=excluded.status,
  price=excluded.price,price_label=excluded.price_label,address=excluded.address,city=excluded.city,
  county=excluded.county,bedrooms=excluded.bedrooms,bathrooms=excluded.bathrooms,
  floor_area=excluded.floor_area,property_reference=excluded.property_reference,
  ber_rating=excluded.ber_rating,parking=excluded.parking,featured=excluded.featured,
  new_home=excluded.new_home,demo_data=true,published=true,updated_at=now();

insert into public.developments
  (slug,name,location,description,unit_count,availability,price_from,completion_date,published,demo_data)
values
  ('demo-development-glasnevin','DEMO / SAMPLE - Botanic Quarter','Glasnevin, Dublin 9','Fictional development fixture for preview and testing only. Not an actual development.',28,'Sample availability only',425000,'2027-09-01',true,true),
  ('demo-development-citywest','DEMO / SAMPLE - Citywest Gardens','Citywest, Co Dublin','Fictional development fixture for preview and testing only. Not an actual development.',42,'Sample availability only',365000,'2028-03-01',true,true)
on conflict (slug) do update set
  name=excluded.name,location=excluded.location,description=excluded.description,
  unit_count=excluded.unit_count,availability=excluded.availability,
  price_from=excluded.price_from,completion_date=excluded.completion_date,
  published=true,demo_data=true,updated_at=now();
