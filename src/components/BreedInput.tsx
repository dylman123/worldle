import { t } from "i18next";
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { useTranslation } from "react-i18next";
import {
  getBreedName,
  sanitizeBreedName,
  commonBreeds,
  allBreeds,
} from "../domain/breeds";
import { SettingsData } from "../hooks/useSettings";
interface BreedInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
  settingsData: SettingsData;
}

export function BreedInput({
  inputRef,
  currentGuess,
  setCurrentGuess,
  settingsData,
}: BreedInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { i18n } = useTranslation();

  const breedList = settingsData.advancedMode ? allBreeds : commonBreeds;

  return (
    <Autosuggest
      theme={{ suggestionHighlighted: "font-bold" }}
      shouldRenderSuggestions={() => true}
      highlightFirstSuggestion
      suggestions={suggestions}
      onSuggestionsFetchRequested={({ value }) =>
        setSuggestions(
          breedList
            .map((c) => getBreedName(i18n.resolvedLanguage, c))
            .filter((breedName) =>
              sanitizeBreedName(breedName).includes(sanitizeBreedName(value))
            )
            .sort()
        )
      }
      onSuggestionsClearRequested={() => setSuggestions([])}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={(suggestion) => (
        <div className="m-0.5 bg-white dark:bg-slate-800 dark:text-slate-100 p-1 cursor-pointer">
          {suggestion}
        </div>
      )}
      containerProps={{
        className: "border-2 rounded flex-auto relative",
      }}
      inputProps={{
        ref: inputRef,
        className: "w-full dark:bg-slate-800 dark:text-slate-100 p-1",
        placeholder: t("placeholder"),
        value: currentGuess,
        onChange: (_e, { newValue }) => setCurrentGuess(newValue),
      }}
      renderSuggestionsContainer={({ containerProps, children }) => (
        <div
          {...containerProps}
          className={`${containerProps.className} rounded absolute bottom-full w-full bg-gray-300 dark:bg-white mb-1 divide-x-2 max-h-52 overflow-auto`}
        >
          {children}
        </div>
      )}
    />
  );
}
