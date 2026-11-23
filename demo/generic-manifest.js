// Generic atlas rig manifest. Coordinates normalized to atlas.
export const genericManifest = {
  "name": "PuppetKitGeneric",
  "parts": [
    {
      "name": "head",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.0
        },
        {
          "x": 0.25,
          "y": 0.0
        },
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.0,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.125
      },
      "parent": null,
      "z": 1
    },
    {
      "name": "body",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.0
        },
        {
          "x": 0.5,
          "y": 0.0
        },
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.125
      },
      "parent": null,
      "z": 2
    },
    {
      "name": "leftUpperArm",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.0
        },
        {
          "x": 0.75,
          "y": 0.0
        },
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.0325
      },
      "parent": null,
      "z": 3
    },
    {
      "name": "rightUpperArm",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.0
        },
        {
          "x": 1.0,
          "y": 0.0
        },
        {
          "x": 1.0,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.25
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.0325
      },
      "parent": null,
      "z": 4
    },
    {
      "name": "leftForearm",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.0,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.28
      },
      "parent": "leftUpperArm",
      "z": 5
    },
    {
      "name": "rightForearm",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.28
      },
      "parent": "rightUpperArm",
      "z": 6
    },
    {
      "name": "leftHand",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.3
      },
      "parent": "leftForearm",
      "z": 7
    },
    {
      "name": "rightHand",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.25
        },
        {
          "x": 1.0,
          "y": 0.25
        },
        {
          "x": 1.0,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.5
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.3
      },
      "parent": "rightForearm",
      "z": 8
    },
    {
      "name": "leftLeg",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.0,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.53
      },
      "parent": null,
      "z": 9
    },
    {
      "name": "rightLeg",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.53
      },
      "parent": null,
      "z": 10
    },
    {
      "name": "leftFoot",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.625
      },
      "parent": "leftLeg",
      "z": 11
    },
    {
      "name": "rightFoot",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.5
        },
        {
          "x": 1.0,
          "y": 0.5
        },
        {
          "x": 1.0,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 0.75
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.625
      },
      "parent": "rightLeg",
      "z": 12
    },
    {
      "name": "eyes",
      "polygon": [
        {
          "x": 0.0,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.25,
          "y": 1.0
        },
        {
          "x": 0.0,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.125,
        "y": 0.875
      },
      "parent": "head",
      "z": 13
    },
    {
      "name": "brows",
      "polygon": [
        {
          "x": 0.25,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.5,
          "y": 1.0
        },
        {
          "x": 0.25,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.375,
        "y": 0.875
      },
      "parent": "head",
      "z": 14
    },
    {
      "name": "mouth",
      "polygon": [
        {
          "x": 0.5,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 0.75,
          "y": 1.0
        },
        {
          "x": 0.5,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.625,
        "y": 0.875
      },
      "parent": "head",
      "z": 15
    },
    {
      "name": "hairFront",
      "polygon": [
        {
          "x": 0.75,
          "y": 0.75
        },
        {
          "x": 1.0,
          "y": 0.75
        },
        {
          "x": 1.0,
          "y": 1.0
        },
        {
          "x": 0.75,
          "y": 1.0
        }
      ],
      "pivot": {
        "x": 0.875,
        "y": 0.8625
      },
      "parent": "head",
      "z": 16
    }
  ],
  "expressions": {
    "neutral": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "happy": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "surprised": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "sad": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "angry": {
      "eyes": true,
      "brows": true,
      "mouth": true
    },
    "excited": { "eyes": true, "brows": true, "mouth": true },
    "confused": { "eyes": true, "brows": true, "mouth": true }
  }
};

