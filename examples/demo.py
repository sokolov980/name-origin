from src.predictor import SurnamePredictor

predictor = SurnamePredictor()

print(predictor.predict("Kowalski"))
print(predictor.predict("MacArthur"))
print(predictor.predict("Fernandez"))
