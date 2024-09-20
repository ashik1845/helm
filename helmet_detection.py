from time import sleep
from utils import postprocess
import cv2 as cv

# Initialize frame counters
frame_count = 0             
frame_count_out = 0           

# Initialize the parameters
confThreshold = 0.5  # Confidence threshold
nmsThreshold = 0.4   # Non-maximum suppression threshold
inpWidth = 416       # Width of network's input image
inpHeight = 416      # Height of network's input image

# Load names of classes
classesFile = "obj.names"
with open(classesFile, 'rt') as f:
    classes = f.read().rstrip('\n').split('\n')

# Load configuration and weight files for the model and load the network using them
modelConfiguration = "yolov3-obj.cfg"
modelWeights = "yolov3-obj_2400.weights"

net = cv.dnn.readNetFromDarknet(modelConfiguration, modelWeights)
net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)

# Get the names of the output layers
layersNames = net.getLayerNames()
output_layer = [layersNames[i - 1] for i in net.getUnconnectedOutLayers()]

# Open a video capture (default webcam)
cap = cv.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if cv.waitKey(1) & 0xFF == ord('q'):
        break

    # Create a 4D blob from the frame
    blob = cv.dnn.blobFromImage(frame, 1 / 255.0, (inpWidth, inpHeight), [0, 0, 0], 1, crop=False)

    # Set the input to the network
    net.setInput(blob)

    # Perform the forward pass to get the output of the output layers
    outs = net.forward(output_layer)

    # Post-process the output to remove low confidence bounding boxes
    postprocess(frame, outs, confThreshold, nmsThreshold, classes)

    # Show the output frame
    cv.imshow('Detection', frame)

    # Calculate the inference time
    t, _ = net.getPerfProfile()
    label = 'Inference time: %.2f ms' % (t * 1000.0 / cv.getTickFrequency())
    cv.putText(frame, label, (0, 15), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255))

# Release the video capture and close windows
cap.release()
cv.destroyAllWindows()
