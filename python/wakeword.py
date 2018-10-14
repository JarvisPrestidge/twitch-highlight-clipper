#
# Copyright 2018 Picovoice Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import argparse
import os
import platform
import struct
import sys
from threading import Thread

import pyaudio

from lib.porcupine import Porcupine


class PorcupineDemo(Thread):
    """
    Demo class for wake word detection (aka Porcupine) library. It creates an input audio stream from a microphone,
    monitors it, and upon detecting the specified wake word(s) prints the detection time and index of wake word on
    console. It optionally saves the recorded audio into a file for further review.
    """

    def __init__(
            self,
            library_path,
            model_file_path,
            keyword_file_paths,
            sensitivities):
        """
        Constructor.

        :param library_path: Absolute path to Porcupine's dynamic library.
        :param model_file_path: Absolute path to the model parameter file.
        :param keyword_file_paths: List of absolute paths to keyword files.
        :param sensitivities: Sensitivity parameter for each wake word. For more information refer to
        'include/pv_porcupine.h'. It uses the same sensitivity value for all keywords.
        """

        super(PorcupineDemo, self).__init__()

        self._library_path = library_path
        self._model_file_path = model_file_path
        self._keyword_file_paths = keyword_file_paths
        self._sensitivities = sensitivities

    def run(self):
        """
         Creates an input audio stream, initializes wake word detection (Porcupine) object, and monitors the audio
         stream for occurrences of the wake word(s). It prints the time of detection for each occurrence and index of
         wake word.
         """

        num_keywords = len(self._keyword_file_paths)

        keyword_names = [os.path.basename(x).split('_')[0] for x in self._keyword_file_paths]

        porcupine = None
        pa = None
        audio_stream = None
        try:
            porcupine = Porcupine(
                library_path=self._library_path,
                model_file_path=self._model_file_path,
                keyword_file_paths=self._keyword_file_paths,
                sensitivities=self._sensitivities)

            pa = pyaudio.PyAudio()
            audio_stream = pa.open(
                rate=porcupine.sample_rate,
                channels=1,
                format=pyaudio.paInt16,
                input=True,
                frames_per_buffer=porcupine.frame_length)

            while True:
                pcm = audio_stream.read(porcupine.frame_length)
                pcm = struct.unpack_from("h" * porcupine.frame_length, pcm)

                result = porcupine.process(pcm)
                if num_keywords > 1 and result >= 0:
                    print(keyword_names[result])
                    sys.stdout.flush()

        except KeyboardInterrupt:
            print('stopping ...')
        finally:
            if porcupine is not None:
                porcupine.delete()

            if audio_stream is not None:
                audio_stream.close()

            if pa is not None:
                pa.terminate()


def get_library_path():
    if platform.architecture()[0] == '64bit':
        return os.path.join(os.path.dirname(__file__), 'bin', 'libpv_porcupine.dll')
    raise NotImplementedError('Computer architecture not supported')


def get_model_file_path():
    return os.path.join(os.path.dirname(__file__), 'bin', 'porcupine_params.pv')


def get_keyword_file_paths(directory):
    paths = []
    for dirpath, _, filenames in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join(dirpath, filename))
    return paths


if __name__ == '__main__':

    keyword_dir = os.path.join(os.path.dirname(__file__), 'keywords')
    keyword_file_paths = get_keyword_file_paths(keyword_dir)

    if not keyword_file_paths:
        raise ValueError('keyword files are missing from keyward directory')

    sensitivities = [0.5 for x in range(len(keyword_file_paths))]

    PorcupineDemo(
        library_path=get_library_path(),
        model_file_path=get_model_file_path(),
        keyword_file_paths=keyword_file_paths,
        sensitivities=sensitivities
    ).run()
