---
title: "Covid19 Prediction based on Symptoms"
subtitle: "via Random Forest model"
date: 2024-06-24T14:50:50+01:00
draft: false
showAuthor: true
showAuthorBottom: true
---


## GitHub
{{< github repo="avaneesh2001/Covid_Dection_by_Symptoms" >}}

### About Covid 19
_From WHO website_

>Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus.
>Most people infected with the virus will experience mild to moderate respiratory illness and recover without requiring special treatment. However, some will become seriously ill and require medical attention. Older people and those with underlying medical conditions like cardiovascular disease, diabetes, chronic respiratory disease, or cancer are more likely to develop serious illness. Anyone can get sick with COVID-19 and become seriously ill or die at any age.

### Covid Detection model
I have created an ML model which can predict if a person has covid or not using symptoms they have. It is a supervised Classification model (Random forest model) developed using python. The model has a 96.7% Accuracy.

### Dataset
The data for developing model was taken from [Here](https://github.com/nshomron/covidpred/blob/master/data/corona_tested_individuals_ver_006.english.csv.zip)

This dataset was cleaned and Classification performed using python in a jupyter notebook. The cleaned data set can be found in data folder and is saved as ***data.csv***. You can also find it by clicking [here](https://github.com/avaneesh2001/ML_project/blob/main/data/data.csv)

### Classification model
Classification was done using logistic regression and Random forest and the following confusion matrix was obtained.

![Confusion matrix](Confusion_mat.png)
 \
The Accuracy, Precision and recall along with F1 score were better for the random forest model and so I went with it.
