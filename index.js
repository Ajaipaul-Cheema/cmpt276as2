const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 9000

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
})
pool.connect()

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'));
app.get('/database', (req, res) => {
  var getUsersQuery = `SELECT * FROM rectangle`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) res.end(error);
    var results = { 'rows': result.rows };
    res.render('pages/db', results);
  })
});

app.get('/newRectangle', (req, res) => res.render('pages/newRectangle'));
app.get('/rectangles', (req, res) => res.render('pages/db'));

app.get('/viewRectangles/:id', (req, res) => {
  pool.query(`SELECT * FROM rectangle where id=$1`, [req.params.id], (error, result) => {
    if (error) res.end(error);
    var results = { 'rows': result.rows };
    res.render('pages/viewRectangle', results);
  })
});

app.get('/editRectangles/:id', (req, res) => {
  pool.query(`SELECT * FROM rectangle where id=$1`, [req.params.id], (error, result) => {
    if (error) res.end(error);
    var results = { 'rows': result.rows };
    res.render('pages/editRectangle', results);
  })
});

app.post('/addrectangle', (req, res) => {
  try {
    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var color = req.body.color;
    var border = req.body.border;
    var borderColor = req.body.borderColor;
  
    pool.query('insert into rectangle(rectanglename, rectanglewidth, rectangleheight, rectanglecolor, rectangleborder, rectanglebordercolor) values($1, $2, $3, $4, $5, $6)', [name, width, height, color, border, borderColor], (error, result) => {
      var getUsersQuery = `SELECT * FROM rectangle`;
      pool.query(getUsersQuery, (error, result) => {
        if (error) res.end(error);
        var results = { 'rows': result.rows };
        res.render('pages/db', results);
      });
    });
  } catch (error) {
    console.error(error.message);
  }
});

app.get('/rectangles/:id',async (req, res) => {
  const { id } = req.params;
  try {
    const specifiedRectangle = await pool.query("SELECT * FROM rectangle WHERE id = $1", [req.params.id]);
    res.json(specifiedRectangle.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/rectangles/:id", (req, res) => {
  try {
    pool.query(`UPDATE rectangle SET rectanglename = $1, rectanglewidth = $2, rectangleheight = $3, rectanglecolor = $4, rectangleborder = $5,
    rectanglebordercolor = $6 WHERE id = $7 RETURNING *`, [req.body.name, req.body.width, req.body.height,
    req.body.color, req.body.border, req.body.borderColor, req.params.id], (error, result) => {
      var results = { 'rows': result.rows };
      res.render('pages/viewRectangle', results);
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/db/:id", async(req, res) => {
  try {
    pool.query("DELETE FROM rectangle WHERE id =$1 RETURNING *", [req.params.id], (error, result) => {
      var getUsersQuery = `SELECT * FROM rectangle`;
      pool.query(getUsersQuery, (error, result) => {
        if (error) res.end(error);
        var results = { 'rows': result.rows };
        res.render('pages/db', results);
      });
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
