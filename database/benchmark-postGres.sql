EXPLAIN ANALYZE INSERT INTO "abouts"("ticker", "about", "CEO", "open", "employees", "headquarters") VALUES('TEST', 'ABOUT', 'CEO', 'OPEN', 1, 'HQ');
EXPLAIN ANALYZE SELECT * from abouts 

const testObject = {
  ticker: "AAA",
  about: "ABOUT",
  CEO: "CEO",
  open: "OPEN",
  employees: 1,
  headquarters: 'HQ'
}
SELECT * FROM "abouts" WHERE ("employees" < 100);
SELECT ("ticker", "employees") FROM "abouts" WHERE employees > 100000;
SELECT ("ticker", "about") FROM "abouts" WHERE ticker = 'AAAAA';