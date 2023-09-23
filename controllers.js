
const path = require('path');
const fs = require('fs');
const express = require('express');




exports.serveFiles = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.sendFile(filepath);
  });
};


exports.rootRoute = (req, res) => {
  res.send('Welcome to the chat server');
};


exports.uploadFile = (req, res) => {
  console.log(`File upload initiated by ${req.ip}`);
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file || req.files.file.size > 10485760) {
    return res.status(400).send('No files were uploaded.');
  }


  let uploadedFile = req.files.file;
  let uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

  
  uploadedFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
};
