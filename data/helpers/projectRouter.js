const express = require('express')

const projectModel = require('./projectModel')
const actionModel = require('./actionModel')
const router = express.Router()

///////////CONTENTS////////////

//GET ACTIONS OF ONE PROJECT
//GET ALL PROJECTS
//GET PROJECTS BY ID
//POST PROJECT
//UPDATE PROJECT
//REMOVE PROJECT
//POST ACTION IN SPECIFIC PROJECT ID
//-----------------//
//CUSTOM MIDDLEWARES
//VALIDATEACTION
//VALIDATEPROJECTID
//VALIDATEPROJECT
//-----------------//
//GET ACTIONS OF ONE PROJECT ID - USE GET WITH localhost:port/projects/:id/actions
router.get("/:id/actions", validateProjectId(), (req, res, next) => {
    projectModel.getProjectActions(req.params.id)
        .then((actions) => {
            res.status(200).json(actions)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

//GET ALL PROJECTS - USE GET WITH localhost:port/projects
router.get("/", (req, res, next) => {
    projectModel.get()
        .then((projects) => {
            res.status(200).json(projects)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

//GET PROJECTS BY ID - USE GET WITH localhost:port/projects/:id
router.get("/:id", validateProjectId(), (req, res) => {
    res.status(200).json(req.project)
})

//POST PROJECT- USE POST WITH localhost:port/projects
router.post("/", validateProject(), (req, res, next) => {
    projectModel.insert(req.project)
        .then((project) => {
            res.status(201).json(project)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

//UPDATE PROJECT - USE PUT WITH localhost:port/projects/:id
router.put("/:id", validateProject(), validateProjectId(), (req, res, next) => {
    const update = {
        name: req.body.name,
        description: req.body.description
    }
    projectModel.update(req.params.id, update)
        .then((project) => {
            res.status(201).json(project)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

//REMOVE PROJECT - USE DELETE WITH localhost:port/projects/:id
router.delete("/:id", validateProjectId(), (req, res, next) => {
    projectModel.remove(req.params.id)
        .then((project) => {
            res.status(200).json(project)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

//POST ACTION IN SPECIFIC PROJECT - USE POST WITH localhost:port/projects/:id/actions
router.post("/:id/actions", validateAction(), validateProjectId(), (req, res, next) => {
    actionModel.insert(req.action)
        .then((action) => {
            res.status(200).json(action)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

function validateAction() {
    return (req, res, next) => {
        if (!req.body.description || !req.body.notes) {
            res.status(404).json({
                message: "Needs to have description and notes"
            })
        }
        else {
            req.action = {
                project_id: req.params.id,
                description: req.body.description,
                notes: req.body.notes
            }
            next()
        }
    }
}

function validateProjectId() {
    return (req, res, next) => {
        projectModel.get(req.params.id)
            .then((project) => {
                if (project) {
                    req.project = project
                    next()
                }
                else {
                    res.status(400).json({
                        message: "invalid id"
                    })
                }
            })
            .catch((error) => {
                console.log(error),
                res.status(500).json({
                    errorMessage: "Something went wrong"
                })
            })
    }
}

function validateProject() {
    return (req, res, next) => {
        if (!req.body.name || !req.body.description) {
            res.status(404).json({
                message: "Missing name or description"
            })
        }
        else {
            req.project = {
                name: req.body.name,
                description: req.body.description
            }
            next()
        }
    }
}



module.exports = router