defmodule Bullshw05.Bullsgame do
    def new do
        newAnswer = randAnswer([])
        %{  
            answer: newAnswer,
            guesses: [],
            guess: "",
            bulls: 0,
            cows: 0,
            wonMsg: "",
            hasWon: false,
        }
    end
  
    def randAnswer(answerArray) do
        if length(answerArray) < 4 do
            newNum = Enum.random(0..9)
            if !Enum.member?(answerArray, Kernel.inspect(newNum)) do
                randAnswer(answerArray ++ [Kernel.inspect(newNum)])
            else 
                randAnswer(answerArray)
            end
        else
            answerArray
        end
    end
      
    def guess(st, letter) do
        if length(st.answer) == 0 do
            %{st | wonMsg: "No answer has been created. Press new game."}
        else
            if length(st.guesses) >= 8 do
                %{st | wonMsg: "Game Over! You have spent all 8 guesses. Press new game.", guess: ""}
            else 
                if st.hasWon do
                    %{st | wonMsg: "Congratulations! You have guessed the number. Press new game.", guess: ""}
                else
                    if String.length(letter) == 4 do
                        # st1 = Map.put(st, :guess, letter)
                        tuple1 = {0, 0}
                        # bullArray = []
                        # bullsTemp = 0
                        # cowsTemp = 0
                        guessArray = String.graphemes(letter)
                        bullsArray = Enum.filter(0..3, fn(x) ->
                            Enum.at(guessArray, x) == Enum.at(st.answer, x)
                        end) 

                        cowsArray = Enum.filter(0..3, fn(x) ->
                            Enum.at(guessArray, x) != Enum.at(st.answer, x) and Enum.member?(st.answer, Enum.at(guessArray, x))
                        end)

                        IO.puts elem(tuple1, 1)
                        IO.puts length(bullsArray)
                        # IO.puts cowsTemp
                        IO.puts length(cowsArray)

                        if length(bullsArray) == 4 do
                            %{st | guess: "", bulls: length(bullsArray), cows: length(cowsArray), wonMsg: "Congratulations! You have guessed the number.", guesses: st.guesses ++ [[letter, length(bullsArray), length(cowsArray)]], hasWon: true}
                        else
                            if length(st.guesses) >= 7 do
                                %{st | guess: "", bulls: length(bullsArray), cows: length(cowsArray), wonMsg: "Game Over! You have spent all 8 guesses.", guesses: st.guesses ++ [[letter, length(bullsArray), length(cowsArray)]]}
                            else 
                                %{st | guess: "", bulls: length(bullsArray), cows: length(cowsArray), guesses: st.guesses ++ [[letter, length(bullsArray), length(cowsArray)]]}
                            end
                        end

                    else 
                        %{st | guess: letter}
                    end
                end
            end
        end
    end

    # # guess -> array
    # def checkGuess(st, guess) do
    #     bullsTemp = 0
    #     cowsTemp = 0
    #     Enum.each(0..3, fn(x) ->
    #         if Enum.at(guess, x) == Enum.at(st.answer, x) do
    #             bullsTemp = bullsTemp + 1
    #         else
    #             if Enum.member?(st.answer, Enum.at(guess, x)) do 
    #                 cowsTemp = cowsTemp + 1
    #             end
    #         end
    #     end)    

    #     st1 = Map.put(st, :bulls, bullsTemp)
    #     st2 = Map.put(st1, :cows, cowsTemp)
    #     st3 = Map.put(st2, :guesses, st.guesses ++ [[guess, bullsTemp, cowsTemp]])
    #     st4 = Map.put(st3, :guess, "")

    #     if bullsTemp == 4 do
    #         %{st | wonMsg: "Congratulations! You have guessed the number.", hasWon: true}
    #     else 
    #         if length(st.guesses) >= 7 do
    #             %{st | wonMsg: "Game Over! You have spent all 8 guesses."}
    #         end
    #     end

    # end

    def view(st) do
        st
    end

    def echo(st, guess) do
        %{st | guess: guess}
    end
  
  end