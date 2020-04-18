const express = require('express')

const actionModel = require('./actionModel')

const router = express.Router()

router.get("/", (req, res, next) => {
    actionModel.get()
        .then((actions) => {
            res.status(200).json(actions)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})
router.get("/:id", validateActionId(), (req, res) => {
    res.status(200).json(req.action)
})

// Post Actions to a specific project id is in projectRouter due to endpoints complication

router.put("/:id", validateAction(), validateActionId(), (req, res, next) => {
    const action = {
        description: req.body.description,
        notes: req.body.notes
    }
    actionModel.update(req.params.id, action)
        .then((action) => {
            res.status(201).json(action)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})

router.delete("/:id", validateActionId(), (req, res, next) => {
    actionModel.remove(req.params.id)
        .then((action) => {
            res.status(204).json(action)
        })
        .catch((error) => {
            console.log(error),
            next()
        })
})
function validateActionId() {
    return (req, res, next) => {
        actionModel.get(req.params.id)
            .then((action) => {
                if (action) {
                    req.action = action
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
module.exports = router;