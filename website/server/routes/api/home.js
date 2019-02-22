'use strict';
/**
 * Developed by Engagement Lab, 2019
 * ==============
 * Route to retrieve data by url
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */
const keystone =  global.keystone,
    mongoose = require('mongoose'),
    Bluebird = require('bluebird');

mongoose.Promise = require('bluebird');

var buildData = (res, lang) => {

    let fields = 'name pdf.href ';
    fields += (lang === 'en') ? 'summary': 'summaryTm';
    fields += ' video1Url video2Url videoThumbnailImages.secure_url';
    let fileFields = (lang === 'en') ? 'guideEn.url' : 'guideTm.url';

    let list = keystone.list('Module').model;
    let listFiles = keystone.list('Files').model;
    let data = list.find({}, fields);
    let dataFiles = listFiles.findOne({}, fileFields);
    
    Bluebird.props({
            content: data,
            files: dataFiles
        })
        .then(results => {
            return res.status(200).json({
                status: 200,
                data: {
                    content: results.content,
                    files: results.files
                }
            });
        }).catch(err => {
            console.log(err);
        })

}

/*
 * Get data
 */
exports.get = function (req, res) {

    let lang = null;
    if (req.params.lang)
        lang = req.params.lang;
    
    return buildData(res, lang);

}