import numpy as np
import cv2 as cv

def postprocess(frame, outs, confThreshold, nmsThreshold, classes):
    frameHeight = frame.shape[0]
    frameWidth = frame.shape[1]

    classIds = []
    confidences = []
    boxes = []

    # Loop over all detections
    for out in outs:
        for detection in out:
            scores = detection[5:]  # Scores for all classes
            classId = np.argmax(scores)  # Class with the highest confidence score
            confidence = scores[classId]  # Confidence of the chosen class

            # Filter out weak detections by confidence threshold
            if confidence > confThreshold:
                # YOLO provides center coordinates, width, and height
                center_x = int(detection[0] * frameWidth)
                center_y = int(detection[1] * frameHeight)
                width = int(detection[2] * frameWidth)
                height = int(detection[3] * frameHeight)
                left = int(center_x - width / 2)
                top = int(center_y - height / 2)

                # Store detection details (classId, confidence, box)
                classIds.append(classId)
                confidences.append(float(confidence))
                boxes.append([left, top, width, height])

    # Apply non-maximum suppression to filter overlapping boxes
    indices = cv.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)

    # Ensure indices are not empty
    if len(indices) > 0:
        for i in indices.flatten():  # Flatten in case it's a multi-dimensional array
            box = boxes[i]
            left, top, width, height = box
            drawPred(frame, classIds[i], confidences[i], left, top, left + width, top + height, classes)
    else:
        print("No Helmet")

# Function to draw the prediction
def drawPred(frame, classId, confidence, left, top, right, bottom, classes):
    # Draw bounding box
    cv.rectangle(frame, (left, top), (right, bottom), (255, 178, 50), 3)

    # Prepare the label with the class name and confidence score
    label = f'{classes[classId]}: {confidence:.2f}'
    
    # Display the label above the bounding box
    labelSize, baseLine = cv.getTextSize(label, cv.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    top = max(top, labelSize[1])
    cv.putText(frame, label, (left, top - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
