require "open-uri"
require "nokogiri"
require 'nkf'
path="/home/eggplant/Downloads/diction_hack/wikipedia_jlpt/N"
jsons=[]
[*1..5].each{|d|
	difficulty=d
	`ls #{path}#{difficulty}`.split("\n").each{|i|
		file_path="#{path}#{difficulty}/#{i}"
		source=Nokogiri::HTML(File.open(file_path))
		source.css("div.jukugorow.first.last").each{|j|
			
			word="";j.css('div.ufn_container').each{|s|word=s[:onclick].scan(/'(.*)'/)[0][0]}
			begin
			a = {
				difficulty:	difficulty,
				word:		word,
				yomigana:	NKF.nkf('-w --hiragana',j.css("div.jukugo>a").map(&:text)[0].
				gsub(/[一-龠々]/,"")),
				pos:		j.css("div.vm>div>span").map(&:text)[0].split(", "),
				mean:		j.css("div.vm").map(&:text).map{|s|s.
				gsub(/#{j.css("div.vm>div>span").map(&:text)[0]}/,"")},
				link:		{
					kanshudo: "https://www.kanshudo.com/word/#{word}",
					wikionary_en: "https://ja.wiktionary.org/wiki/#{word}", 
					wikionary_ja: "https://ja.wiktionary.org/wiki/#{word}",
				},
			};jsons<<a
			rescue NoMethodError;next;end
		}
	}
}
p jsons;exit
File.open("JPLT_data.txt","w"){|f|
	jsons.each{|j|f.puts j} 
}
