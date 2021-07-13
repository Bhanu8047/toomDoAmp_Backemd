module.exports._404_ = (req, res) => {
    res.status(403).send(`
        <h1> Forbidden: 403 </h1>
        <hr />
    `)
}